import express from 'express';
import cors from 'cors';
import { Auth } from './handler';
import path from 'path';

const app = express()
const port = 8000;
const { register, login } = new Auth

app.use(cors())
app.use(express.json())
app.post('/register', register)
app.post('/login', login)

app.listen(port, () => console.log(`server running on ${port}`))