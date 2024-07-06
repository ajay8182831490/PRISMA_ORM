"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// signup signinn update 
const prisma = new client_1.PrismaClient();
const signupSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pareddata = yield signupSchema.parse(req.body);
    const { name, email, password } = pareddata;
    const existinguser = yield prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (existinguser) {
        return res.status(409).json({ error: 'User already exists' });
    }
    // hash the password
    const hashpassword = yield bcrypt.hash(password, 10);
    const user = yield prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashpassword
        }
    });
    const { id } = user;
    const token = yield jwt.sign({ userId: id }, process.env.jwt_secret);
    res.status(200).json({ message: "account has created successfully", token: token });
    //here we will  generate the jwt token 
}));
router.get('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
router.put('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return [];
}));
exports.default = router;
