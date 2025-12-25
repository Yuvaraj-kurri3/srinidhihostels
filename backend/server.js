import express from 'express';
import dotenv from 'dotenv';
import connectDB from './dbconfig/db.js';
import userRoutes from './routes/StudentRoutes.js';
import cors from 'cors';
import session from 'express-session';

const app=express();

app.use(cors({
    origin: 'http://localhost:5173' || 'https://srinidhihostels.netlify.app/',
    credentials: true
}));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'srinidhi-hostels-secret-key-2024',
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
    cookie: { 
        secure: false,
        maxAge: 3600000,
        httpOnly: false,
        sameSite: 'lax',
        domain: 'localhost'
    }
}));

const port= process.env.SRINIDHI_PORT || 5000;
connectDB();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.use('/api/students',userRoutes);
app.get('/',(req,res)=>{
    res.send('Srinidhi Hostels Backend is running');
})

app.listen(port, ()=>{
    console.log(`Server is running on port http://localhost:${port}`);
})