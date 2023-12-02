import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const tokenKey = 'cobadulugih';

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                username: String(username)
            }
        });
        if (!user || user.password !== password) {
            res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
            return res.status(401).json({ error: 'Username or Password incorrec' });
        }
        const token = jwt.sign({ userId: user.id }, tokenKey, { expiresIn: '1h' });
        res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
        res.status(500).json({ error: 'Internal server error.' });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        // Extrack username and email from request body
        const { username, email } = req.body;

        // Check if username and email already used.
        const existUser = await prisma.user.findUnique({
            where: {
                username: String(username),
                email: String(email),
            }
        });

        if (existUser) {
            res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
            return res.status(400).json({ message: "Username or Email already used." });
        }

        // If unique, create new user
        const result = await prisma.user.create({
            data: {
                ...req.body
            }
        });
        res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
        res.json(result);
    } catch (error) {
        console.error(error);
        res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30') // set caching header
        res.status(500).json({ error: 'Sorry, please fill the data correctly !!' });
    }
}