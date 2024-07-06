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
const { auth } = require('../middleware/userMiddleware');
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const zod_1 = require("zod");
// get all comment of speacific post 
// create comment 
//delete comment
router.get('/comment/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const post = yield prisma.post.findUnique({
        where: {
            id: Number(postId)
        }
    });
    if (!post) {
        return res.status(409).json('post does not exist');
    }
    const comments = yield prisma.comment.findMany({
        where: {
            postId: Number(postId),
        },
    });
    res.status(200).json(comments);
}));
const commentSchema = zod_1.z.object({
    comment: zod_1.z.string().min(1, "Comment cannot be empty"),
});
router.post('/comment/:postId', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const userId = req.userId;
    const post = yield prisma.post.findUnique({
        where: {
            id: Number(postId)
        }
    });
    if (!post) {
        return res.status(409).json("post does not exist");
    }
    const parsedData = commentSchema.parse(req.body);
    const { comment } = parsedData;
    yield prisma.comment.create({
        data: {
            comment: comment,
            postId: Number(postId),
            userId
        }
    });
    res.status(200).json("comment added successfully");
}));
router.delete('/deleteComment/:commentId', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { commentId } = req.params;
    const comment = yield prisma.comment.findUnique({ where: {
            id: Number(commentId)
        } });
    if (!comment) {
        return res.status(400).json("comment does not exist");
    }
    yield prisma.comment.delete({ where: {
            id: Number(commentId)
        } });
    res.status(200).json("comment deleted successfully");
}));
exports.default = router;
