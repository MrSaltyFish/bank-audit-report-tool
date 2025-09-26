import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function decodeAuthToken(token: string): string {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      role: string[];
      email: string;
      [key: string]: any;
    };
    return payload.sub;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
