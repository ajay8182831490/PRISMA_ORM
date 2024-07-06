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
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const { auth } = require('../middleware/userMiddleware');
// post create new post read post user-specific post update post delete post get all post
// getting all post 
router.get('/allpost', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield prisma.post.findMany({
        include: {
            comment: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });
    res.status(200).json(post);
}));
const postSchema = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    published: zod_1.z.boolean().optional()
});
router.post('/createPost', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseddata = postSchema.parse(req.body);
    const { title, content, published } = parseddata;
    const userId = req.userId;
    const post = yield prisma.post.create({
        data: {
            title: title,
            content: content,
            published: true,
            authorId: userId
        }
    });
    res.status(200).json(post);
}));
router.get('/userPost', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const post = yield prisma.post.findMany({ where: {
            authorId: userId
        },
        include: {
            comment: true,
            author: {
                select: {
                    name: true,
                }
            },
        }
    });
    res.status(200).json(post);
}));
// delete post
router.delete('/deletpost/:postId', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { postId } = req.params;
    // here we have need to check the author of post should be same as the login user;
    const post = yield prisma.post.findUnique({ where: {
            id: Number(postId)
        } });
    if (!post) {
        return res.status(400)
            .json("post doesn't exist");
    }
    if (post.authorId !== userId) {
        return res.status(400).json({ message: 'you are not authorize to delete the post' });
    }
    yield prisma.post.delete({
        where: {
            id: Number(postId),
        }
    });
    res.status(200).json("post deleted successfully");
}));
const postUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
    published: zod_1.z.boolean().optional()
});
router.put('/updatePost/:postId', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const userId = req.userId;
    const parsedData = postUpdateSchema.parse(req.body);
    const { title, published, content } = parsedData;
    const post = yield prisma.post.findUnique({
        where: {
            id: Number(postId)
        }
    });
    if (!post) {
        return res.status(400).json("post does not exist");
    }
    if (post.authorId != userId) {
        return res.status(400).json("you are not authorize to update the post");
    }
    const update = {};
    if (title !== undefined) {
        update.title = title;
    }
    if (content !== undefined) {
        update.content = content;
    }
    if (published !== undefined) {
        update.published = published;
    }
    yield prisma.post.update({
        data: update,
        where: {
            id: Number(postId)
        }
    });
    res.status(200).json('post udated successfully');
}));
zod_1.z;
exports.default = router;
