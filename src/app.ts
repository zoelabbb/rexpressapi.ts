import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import createHttpError from "http-errors";

import postRouter from "./routes/postRoutes";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.use("/post", postRouter);

// Route home
app.get('/', (_req: Request, res: Response) => {
    const welcome = '<h1>Welcome to Express Js & Typescript Rest API with Prisma</h1>';
    const isi = '<p>Routes : <a href="/feed">/feed</a> | <a href="/user">/user</a></p>';

    const htmlresponse = welcome + isi;
    res.send(htmlresponse);
});

// Get all feed, using method findMany()
app.get("/feed", async (_req: Request, res: Response) => {
    const posts = await prisma.post.findMany({
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
});

// Get create user
app.post('/user', async (_req: Request, res: Response) => {
    try {
        // Extrack username and email from request body
        const { username, email } = _req.body;

        // Check if username and email already used.
        const existUser = await prisma.user.findUnique({
            where: {
                username: String(username),
                email: String(email)
            }
        });

        if (existUser) {
            return res.status(400).json({ message: "Username or Email already used." });
        }

        // If unique, create new user
        const result = await prisma.user.create({
            data: {
                ..._req.body
            }
        });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sorry, please fill the data correctly !!' });
    }
});

// Get user by username
app.get('/:username', async (_req: Request, res: Response) => {
    try {
        const { username } = _req.params;

        // Find user by username
        const user = await prisma.user.findUnique({
            where: {
                username: String(username)
            }
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sorry, you cannot find this user !!' });
    }
})

// Handle 404 error
app.use((_req: Request, _res: Response, next: Function) => {
    next(createHttpError(404));
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});