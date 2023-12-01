import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import createHttpError from "http-errors";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// TODO: Routing aplikasi
app.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to Express Js & Typescript Rest API with Prisma');
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

app.post('/post', async (_req: Request, res: Response) => {
    const { content, authorEmail } = _req.body;
    const result = await prisma.post.create({
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
});

// Get post by ID
app.get('/post/:id', async (_req: Request, res: Response) => {
    const { id } = _req.params;
    const post = await prisma.post.findUnique({
        where: {
            id: Number(id)
        }
    });
    res.json(post);
});

// Get put post by ID
app.put('/post/:id', async (_req: Request, res: Response) => {
    const { id } = _req.params;
    const post = await prisma.post.update({
        where: {
            id: Number(id)
        },
        data: {
            ..._req.body
        }
    })
    res.json(post);
});

// Delete post by ID
app.delete('/post/:id', async (_req: Request, res: Response) => {
    const { id } = _req.params;
    const post = await prisma.post.delete({
        where: {
            id: Number(id)
        }
    })
    res.json(post);
});

// Get create user
app.post('/user', async (_req: Request, res: Response) => {
    const result = await prisma.user.create({
        data: {
            ..._req.body
        }
    });
    res.json(result);
});

app.get('/:username',async (_req:Request, res:Response) => {
    const { username } = _req.params;
    const user = await prisma.user.findUnique({
        where: {
            username: String(username)
        }
    });
    res.json(user);
})

// Handle 404 error
app.use((_req: Request, _res: Response, next: Function) => {
    next(createHttpError(404));
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});