"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeTruncate = safeTruncate;
function safeTruncate(s, max = 240) {
    if (s.length <= max)
        return s;
    return s.slice(0, max - 3) + "...";
}
