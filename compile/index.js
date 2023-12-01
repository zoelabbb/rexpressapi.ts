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
const http_errors_1 = __importDefault(require("http-errors"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// TODO: Routing aplikasi
app.get('/', (_req, res) => {
    res.send('Welcome to Express Js & Typescript Rest API with Prisma');
});
// Get all feed, using method findMany()
app.get("/feed", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield prisma.post.findMany({
        include: {
            author: true
        }
    });
    if (posts.length === 0) {
        // Return 404 if posts not found
        return res.status(404).json({ message: "Posts not found, try create one." });
    }
    // Return all posts.
    res.json(posts);
}));
app.post('/post', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, authorEmail } = _req.body;
    const result = yield prisma.post.create({
        data: {
            content,
            author: {
                connect: {
                    email: authorEmail
                }
            }
        }
    });
    res.json(result);
}));
// Get post by ID
app.get('/post/:id', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = _req.params;
    const post = yield prisma.post.findUnique({
        where: {
            id: Number(id)
        }
    });
    res.json(post);
}));
// Get put post by ID
app.put('/post/:id', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = _req.params;
    const post = yield prisma.post.update({
        where: {
            id: Number(id)
        },
        data: Object.assign({}, _req.body)
    });
    res.json(post);
}));
// Delete post by ID
app.delete('/post/:id', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = _req.params;
    const post = yield prisma.post.delete({
        where: {
            id: Number(id)
        }
    });
    res.json(post);
}));
// Get create user
app.post('/user', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.create({
        data: Object.assign({}, _req.body)
    });
    res.json(result);
}));
app.get('/:username', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = _req.params;
    const user = yield prisma.user.findUnique({
        where: {
            username: String(username)
        }
    });
    res.json(user);
}));
// Handle 404 error
app.use((_req, _res, next) => {
    next((0, http_errors_1.default)(404));
});
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
