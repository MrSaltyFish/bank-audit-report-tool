import { z } from "zod";

export const loginSchema = z.object({
	email: z.email({ message: "Invalid e-mail address" }),
	password: z
		.string()
		.min(8, { message: "Password must be 8+ characters." })
		.max(72), // bcrypt
});

export const registerSchema = z.object({
	username: z
		.string()
		.min(6, { error: "Minimum 6 characters." })
		.max(16, { error: "Must be lower than 16 characters." }),
	email: z.email({ message: "Invalid e-mail address" }),
	password: z
		.string()
		.min(8, { error: "Password must be longer than 8 characters." })
		.max(72), // bcrypt
});

export const resetSchema = z.object({
	email: z.email(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof registerSchema>;
export type ResetInput = z.infer<typeof resetSchema>;
