import express, { Request, Response } from 'express';
const { json } = require('stream/consumers');

import userRouter from  './UserRouter/userRouter'
const app=express();
app.use(express.json());




app.use('/user',userRouter);

app.listen(3000,()=>{
    console.log("server is running on port number 3000");
})