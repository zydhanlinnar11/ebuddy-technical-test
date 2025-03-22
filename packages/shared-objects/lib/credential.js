"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credsSchema = void 0;
const zod_1 = require("zod");
exports.credsSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
//# sourceMappingURL=credential.js.map