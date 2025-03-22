"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const yup_1 = require("yup");
exports.userSchema = (0, yup_1.object)({
    id: (0, yup_1.number)().required(),
    name: (0, yup_1.string)().required(),
    email: (0, yup_1.string)().email().required(),
});
//# sourceMappingURL=user.js.map