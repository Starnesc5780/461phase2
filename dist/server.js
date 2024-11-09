"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});
// Export handler to be used by Lambda
module.exports.handler = (0, serverless_http_1.default)(app);
//# sourceMappingURL=server.js.map