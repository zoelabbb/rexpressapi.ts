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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/post", postRoutes_1.default);
// Route home
app.get('/', (_req, res) => {
    const welcome = '<h1>Welcome to Express Js & Typescript Rest API with Prisma</h1>';
    const isi = '<p>Routes : <a href="/feed">/feed</a> | <a href="/user">/user</a></p>';
    const htmlresponse = welcome + isi;
    res.send(htmlresponse);
});
const tokenKey = 'cobadulugih';
// Route login
app.get('/login', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = _req.body;
        // Validasi username dan password
        const user = yield prisma.user.findUnique({
            where: {
                username: String(username)
            }
        });
        if (!user || user.username !== password) {
            return res.status(401).json({ error: 'Username or Password incorrec' });
        }
        // Jika valid buat token JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, tokenKey, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Username or Password incorrec' });
    }
}));
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
// Get create user
app.post('/user', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extrack username and email from request body
        const { username, email } = _req.body;
        // Check if username and email already used.
        const existUser = yield prisma.user.findUnique({
            where: {
                username: String(username),
                email: String(email)
            }
        });
        if (existUser) {
            return res.status(400).json({ message: "Username or Email already used." });
        }
        // If unique, create new user
        const result = yield prisma.user.create({
            data: Object.assign({}, _req.body)
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sorry, please fill the data correctly !!' });
    }
}));
// Get user by username
app.get('/:username', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = _req.params;
        // Find user by username
        const user = yield prisma.user.findUnique({
            where: {
                username: String(username)
            }
        });
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sorry, you cannot find this user !!' });
    }
}));
// Handle 404 error
app.use((_req, _res, next) => {
    next((0, http_errors_1.default)(404));
});
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
//# sourceMappingURL=app.js.map