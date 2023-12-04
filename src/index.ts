// import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import createHttpError from "http-errors";

import postRouter from "./routes/postRoutes";
import userRouter from "./routes/userRoutes";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 8080

app.use(express.json());

// Route home
app.get('/', (_req: Request, res: Response) => {
    const welcome = '<h1>Welcome to Express Js & Typescript Rest API with Prisma</h1>';
    const isi = '<p>Routes : <a href="/feed">/feed</a> | <a href="/user">/user</a></p>';

    const htmlresponse = welcome + isi;
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
    res.send(htmlresponse);
});

app.use("/post", postRouter);
app.use('/login', userRouter);
app.use('/auth', userRouter);

// Get all feed, using method findMany()
app.get("/feed", async (_req: Request, res: Response) => {
    const posts = await prisma.post.findMany({
        include: {
            author: true
        }
    });

    if (posts.length === 0) {
        // Return 404 if posts not found
        res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
        return res.status(404).json({ message: "Posts not found, try create one." });
    }

    // Return all posts.
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
    res.json(posts);
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
        res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
        res.status(500).json({ error: 'Sorry, you cannot find this user !!' });
    }
})

// Handle 404 error
app.use((_req: Request, _res: Response, next: Function) => {
    next(createHttpError(404));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});