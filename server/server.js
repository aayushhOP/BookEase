import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDb from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'

const app = express();
const port = 3000;

await connectDb()

//middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

//api routes
app.get('/', (req,res) => res.send('Server is Live!'))

app.listen(port, () => console.log(`server listening at http://localhost:${port}`));