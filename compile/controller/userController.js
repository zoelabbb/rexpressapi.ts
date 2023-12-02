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
exports.createUser = exports.login = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const tokenKey = 'cobadulugih';
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield prisma.user.findUnique({
            where: {
                username: String(username)
            }
        });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Username or Password incorrec' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, tokenKey, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.login = login;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extrack username and email from request body
        const { username, email } = req.body;
        // Check if username and email already used.
        const existUser = yield prisma.user.findUnique({
            where: {
                username: String(username),
                email: String(email),
            }
        });
        if (existUser) {
            return res.status(400).json({ message: "Username or Email already used." });
        }
        // If unique, create new user
        const result = yield prisma.user.create({
            data: Object.assign({}, req.body)
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sorry, please fill the data correctly !!' });
    }
});
exports.createUser = createUser;
//# sourceMappingURL=userController.js.map