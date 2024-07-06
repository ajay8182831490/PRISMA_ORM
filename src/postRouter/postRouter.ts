import { Prisma, PrismaClient } from '@prisma/client';
import express,{Request,Response} from 'express';
import {z} from 'zod';

const prisma=new PrismaClient()
const router=express.Router();

// post create new post read post user-specific post update post delete post get all post

// getting all post 
router.get('/allpost',async (req:Request,res:Response)=>{
    const post=await prisma.post.findMany({
        include:{
           comment :true,
           author: true

        }
    });
    res.status(200).json(post);
})

export default router;