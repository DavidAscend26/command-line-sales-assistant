"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = t;
const en_1 = require("./en");
const DICTS = { en: en_1.EN };
function t(locale, key, vars = {}) {
    const template = DICTS[locale][key];
    return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}
