"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.formatError = formatError;
class AppError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
exports.AppError = AppError;
function formatError(err) {
    if (err instanceof AppError) {
        return { error: { code: err.code, message: err.message } };
    }
    if (err instanceof Error) {
        return { error: { code: "INTERNAL", message: err.message } };
    }
    return { error: { code: "INTERNAL", message: "Unknown error" } };
}
