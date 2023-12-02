import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, authorEmail } = req.body;
    const result = await prisma.post.create({
      data: {
        content,
        author: {
          connect: {
            email: authorEmail,
          },
        },
      },
    });
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sorry, please fill the data first !!' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updatePostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        ...req.body,
      },
    });
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deletePostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
