export type ErrorCode = "BAD_REQUEST" | "NOT_FOUND" | "GUARDRAIL" | "INTERNAL";

export class AppError extends Error {
  public code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

export function formatError(err: unknown): { error: { code: ErrorCode; message: string } } {
  if (err instanceof AppError) {
    return { error: { code: err.code, message: err.message } };
  }
  if (err instanceof Error) {
    return { error: { code: "INTERNAL", message: err.message } };
  }
  return { error: { code: "INTERNAL", message: "Unknown error" } };
}