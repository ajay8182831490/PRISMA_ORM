"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { json } = require('stream/consumers');
const userRouter_1 = __importDefault(require("./UserRouter/userRouter"));
const postRouter_1 = __importDefault(require("./postRouter/postRouter"));
const commentRouter_1 = __importDefault(require("./commentRouter/commentRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/user', userRouter_1.default);
app.use('/post', postRouter_1.default);
app.use('/comment', commentRouter_1.default);
app.listen(3000, () => {
    console.log("server is running on port number 3000");
});
