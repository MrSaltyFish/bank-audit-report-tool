const { PDFDocument } = require("pdf-lib");
const Bank = require("../models/Bank.model");

async function pdf_generateReport(bankId, format) {
  const bankData = await Bank.findById(bankId);
  if (!bankData) {
    throw new Error("Bank not found");
  }

  const masterData = await MasterDatabase.find({ bank: bankId });
  const observationData = await Observations.find({
    accountNo: { $in: masterData.map((entry) => entry.accountNo) },
  });

  let reportBuffer;

  if (format === "pdf") {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    let reportContent = `Report for Bank Name: ${bankData.bankName}\n`;

    reportContent += "Bank Details:\n";
    reportContent += `Bank Name: ${bankData.bankName}\n`;
    reportContent += "Branches:\n";
    reportContent += ` - ${bankData.branchName}, Location: ${bankData.branchLocation}\n`;

    reportContent += "\nMaster Database Entries:\n";
    masterData.forEach((entry) => {
      reportContent += ` - Account No: ${entry.accountNo}, Name: ${entry.nameOfBorrower}, Amount: ${entry.sanctionedAmount}\n`;
    });

    reportContent += "\nObservations:\n";
    observationData.forEach((obs) => {
      reportContent += ` - Query: ${obs.query}, Details: ${obs.details}\n`;
    });

    page.drawText(reportContent, { x: 50, y: page.getHeight() - 50 });
    reportBuffer = await pdfDoc.save();
  } else if (format === "word") {
    let reportContent = `Report for Bank Name: ${bankData.bankName}\n`;
    reportContent += "Bank Details:\n";
    reportContent += `Bank Name: ${bankData.bankName}\n`;
    reportContent += "Branches:\n";
    reportContent += ` - ${bankData.branchName}, Location: ${bankData.branchLocation}\n`;

    reportContent += "\nMaster Database Entries:\n";
    masterData.forEach((entry) => {
      reportContent += ` - Account No: ${entry.accountNo}, Name: ${entry.nameOfBorrower}, Amount: ${entry.sanctionedAmount}\n`;

      // Find observations related to the current master database entry
      const relatedObservations = observationData.filter(
        (obs) => obs.accountNo === entry.accountNo
      );

      if (relatedObservations.length > 0) {
        reportContent += "   Observations:\n"; // Indent for better visibility
        relatedObservations.forEach((obs) => {
          reportContent += `     - Query: ${obs.query}, Details: ${obs.details}\n`;
        });
      } else {
        reportContent += "   No observations found.\n"; // Handle case with no observations
      }
    });

    reportBuffer = Buffer.from(reportContent, "utf-8");
  }

  return reportBuffer;
}

const generateReport = async (req, res) => {
  const { bankId, format } = req.query;

  try {
    const reportBuffer = await pdf_generateReport(bankId, format);

    if (format === "pdf") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    } else if (format === "word") {
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader("Content-Disposition", "attachment; filename=report.docx");
    }

    res.send(reportBuffer);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).send("Error generating report");
  }
};

module.exports = { generateReport };
