export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is missing");
}
