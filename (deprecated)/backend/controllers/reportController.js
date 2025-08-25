const mongoose = require("mongoose");
const Bank = require("../models/Bank.model");
const MasterDatabase = require("../models/MasterDatabase.model");
const Observations = require("../models/Observations.model");

const logger = require("../utils/logger");

const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const { Document, Packer, Paragraph, TextRun } = require("docx");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function generatePdfReport(bankId) {
  const bankData = await Bank.findById(bankId);
  if (!bankData) throw new Error("Bank not found");

  logger.debug(`Fetched bank data: ${bankData.bankName} (${bankData._id})`);

  const masterData = await MasterDatabase.find({ bank: bankId });
  const observationData = await Observations.find({
    accountNo: { $in: masterData.map((entry) => entry.accountNo) },
  });

  logger.debug(
    `Fetched ${masterData.length} master entries and ${observationData.length} observations for report.`
  );

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  let reportContent = `Report for Bank: ${bankData.bankName}\n`;

  reportContent += `Branch: ${bankData.branchName}, Location: ${bankData.branchLocation}\n\n`;
  masterData.forEach((entry) => {
    reportContent += `Account No: ${entry.accountNo}, Borrower: ${entry.nameOfBorrower}, Amount: ${entry.sanctionedAmount}\n`;
  });

  observationData.forEach((obs) => {
    reportContent += `Observation: ${obs.query}, Details: ${obs.details}\n`;
  });

  page.drawText(reportContent, { x: 50, y: page.getHeight() - 50 });
  return await pdfDoc.save();
}
async function generateDocxReport(bankId) {
  const bankData = await Bank.findById(bankId);
  if (!bankData) throw new Error("Bank not found");

  const masterData = await MasterDatabase.find({ bank: bankId });
  const observationData = await Observations.find({
    accountNo: { $in: masterData.map((entry) => entry.accountNo) },
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun(`Report for Bank: ${bankData.bankName}`)],
          }),
          new Paragraph({
            children: [
              new TextRun(
                `Branch: ${bankData.branchName}, Location: ${bankData.branchLocation}`
              ),
            ],
          }),
          new Paragraph({ text: "" }),
          ...masterData.map(
            (entry) =>
              new Paragraph({
                children: [
                  new TextRun(
                    `Account No: ${entry.accountNo}, Name: ${entry.nameOfBorrower}, Amount: ${entry.sanctionedAmount}`
                  ),
                ],
              })
          ),
          new Paragraph({ text: "Observations:", bold: true }),
          ...observationData.map(
            (obs) =>
              new Paragraph({
                children: [new TextRun(`- ${obs.query}: ${obs.details}`)],
              })
          ),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc); // Return .docx buffer
}

const generateReport = async (req, res) => {
  const { bankId, format } = req.body;

  logger.info(
    `Received report generation request from IP ${req.ip} for bankId: ${bankId}, format: ${format}`
  );

  if (!mongoose.Types.ObjectId.isValid(bankId)) {
    logger.warn(`Invalid bankId format received: ${bankId} from IP ${req.ip}`);
    return res.status(400).send("Invalid bankId format");
  }

  try {
    let reportBuffer;
    logger.info(
      `Generating ${format.toUpperCase()} report for bankId: ${bankId}`
    );
    if (format === "pdf") {
      reportBuffer = await generatePdfReport(bankId);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=report_${bankId}.pdf`
      );
    } else if (format === "word") {
      reportBuffer = await generateDocxReport(bankId);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=report_${bankId}.docx`
      );
    } else {
      return res.status(400).send("Invalid format. Choose 'pdf' or 'word'.");
    }

    res.send(reportBuffer);
    logger.info(
      `Successfully generated and sent ${format.toUpperCase()} report for bankId: ${bankId}`
    );
  } catch (error) {
    logger.error(
      `Error generating report for bankId: ${bankId} from IP ${req.ip}:`,
      error
    );
    console.error("Error generating report:", error);
    res.status(500).send("Error generating report");
  }
};

async function generateDocx() {
  // Create a new document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun("Hello world!"),
              new TextRun({
                text: " This is bold text.",
                bold: true,
              }),
              new TextRun({
                text: " And this is underlined.",
                underline: {},
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Generate the file
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("sample.docx", buffer);
  logger.info("Sample DOCX file generated as 'sample.docx'");
  console.log("✅ DOCX file created as 'sample.docx'");
}

module.exports = { generatePdfReport, generateDocxReport, generateReport };
