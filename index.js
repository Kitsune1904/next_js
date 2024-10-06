"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartRoutes_js_1 = __importDefault(require("./routes/cartRoutes.js"));
const constants_1 = require("./constants");
const user_controllers_js_1 = require("./controllers/user.controllers.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const prodRoutes_js_1 = __importDefault(require("./routes/prodRoutes.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/register', user_controllers_js_1.signUp);
app.use('/api/products', prodRoutes_js_1.default);
app.use('/api/cart', cartRoutes_js_1.default);
app.use(errorHandler_js_1.errorHandler);
app.listen(constants_1.PORT, () => {
    console.log(`Server is running on port ${constants_1.PORT}`);
});
