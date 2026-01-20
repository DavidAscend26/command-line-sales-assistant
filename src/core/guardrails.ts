import { AppError } from "../utils/errors";

const FORBIDDEN_SEND_PATTERNS = [
  /\bi sent\b/i,
  /\bi have sent\b/i,
  /\bi've sent\b/i,
  /\bsent the email\b/i,
  /\bemail has been sent\b/i,
  /\bemailed them\b/i
];

export function enforceDraftOnly(text: string): void {
  for (const re of FORBIDDEN_SEND_PATTERNS) {
    if (re.test(text)) {
      throw new AppError(
        "GUARDRAIL",
        "Guardrail violation: Output implies an email was sent. Must be draft-only."
      );
    }
  }
}