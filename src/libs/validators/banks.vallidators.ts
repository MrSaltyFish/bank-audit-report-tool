import { z } from "zod";

export const createBankSchema = z.object({
  bankName: z.string({ error: "Bank Name not proper." }),
  branchName: z.string({ error: "Laude ki location" }),
});

export const deleteBankSchema = z.object({
  bankName: z.string({ error: "Bank Name not proper." }),
});

export type createBankSchema = z.infer<typeof createBankSchema>;
export type deleteBankSchema = z.infer<typeof deleteBankSchema>;
