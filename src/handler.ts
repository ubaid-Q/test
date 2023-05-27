import { Request, Response } from "express";
import JOI from 'joi';
import { Users } from "./models";
import { randomUUID } from 'crypto';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import _users from '../users.json';
import fs from 'fs/promises';
import path from 'path';


const users = _users as Users;
const filePath = path.join(__dirname, '..', '/users.json')

export class Auth {
    async register(req: Request, res: Response) {
        try {
            const validator = JOI.object({
                name: JOI.string().required(),
                email: JOI.string().email().required(),
                password: JOI.string().regex(/^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()\-_=+{};:'",.<>/?[\]\\ ]*$/)
                    .message("Password length should be greater than 6 & contains alphanumeric").required()
            }).validate(req.body, { abortEarly: false }).error?.details.map((err) => err.message)

            if (validator?.length) {
                return res.status(400).json({ message: 'Validation Error.', error: validator })
            }
            const { name, email, password } = req.body;

            if (users[email]) {
                return res.status(400).json({ message: 'User already exists...' });
            }
            const hashedPassword = await hash(password, 10)
            users[email] = {
                id: randomUUID(),
                name,
                password: hashedPassword
            }


            fs.writeFile(filePath, JSON.stringify(users))
            const token = sign({ id: users[email].id }, 'SecretKey')
            return res.status(201).json({ message: 'Register success.', data: { token } })

        } catch (error) {
            return res.status(500).json({ message: 'something went wrong' })
        }
    }

    async login(req: Request, res: Response) {
        const validator = JOI.object({
            email: JOI.string().email().required(),
            password: JOI.string().required()
        }).validate(req.body, { abortEarly: false }).error?.details.map((err) => err.message)

        if (validator?.length) {
            return res.status(400).json({ message: 'Validation Error.', error: validator })
        }
        const { email, password } = req.body;

        if (!users[email]) {
            return res.status(400).json({ message: 'Invalid email / password' });
        }

        const isValidPassword = await compare(password, users[email].password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid email / password' });
        }
        const token = sign({ id: users[email].id }, 'SecretKey')
        return res.status(200).json({ message: 'Login success.', data: { token } })
    }
}