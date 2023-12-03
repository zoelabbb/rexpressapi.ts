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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostById = exports.updatePostById = exports.getPostById = exports.createPost = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, authorEmail } = req.body;
        const result = yield prisma.post.create({
            data: {
                content,
                author: {
                    connect: {
                        email: authorEmail,
                    },
                },
            },
        });
        res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30'); // set caching header
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sorry, please fill the data first !!' });
    }
});
exports.createPost = createPost;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const post = yield prisma.post.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30'); // set caching header
        res.json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getPostById = getPostById;
const updatePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const post = yield prisma.post.update({
            where: {
                id: Number(id),
            },
            data: Object.assign({}, req.body),
        });
        res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30'); // set caching header
        res.json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updatePostById = updatePostById;
const deletePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const post = yield prisma.post.delete({
            where: {
                id: Number(id),
            },
        });
        res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30'); // set caching header
        res.json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deletePostById = deletePostById;
//# sourceMappingURL=postController.js.map