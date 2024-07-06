import express, { Request, Response } from 'express';
const { json } = require('stream/consumers');

import userRouter from  './UserRouter/userRouter'

import postRouter from './postRouter/postRouter';
import commentRouter from './commentRouter/commentRouter'
const app=express();
app.use(express.json());




app.use('/user',userRouter);
app.use('/post',postRouter);
app.use('/comment',commentRouter);

app.listen(3000,()=>{
    console.log("server is running on port number 3000");
})