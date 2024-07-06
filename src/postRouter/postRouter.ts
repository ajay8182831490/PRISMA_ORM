import { Prisma, PrismaClient } from '@prisma/client';
import express,{request, Request,Response} from 'express';
import { title } from 'process';
import {z} from 'zod';

const prisma=new PrismaClient()
const router=express.Router();

const authmidleware=require('../middleware/userMiddleware')

// post create new post read post user-specific post update post delete post get all post

// getting all post 
router.get('/allpost',async (req:Request,res:Response)=>{
    const post=await prisma.post.findMany({
        include:{
           comment :true,
           author: {
            select:{
                 name:true
            }
           }

        }
    });
    res.status(200).json(post);
})


const postSchema=z.object({
    title:z.string(),
    content:z.string(),
    published:z.boolean()

})
router.get('/createPost',authmidleware,async (req:Request,res:Response)=>{
       const parseddata=postSchema.parse(req.body);
       const {title,content,published}=parseddata;

       const userId=(req as any).userId;


       const post=await prisma.post.create({
         
       
    data:{
        title:title,
        content:content,
        published:true,
        authorId:userId
    }})
    res.status(200).json(post);
})
router.get('/userPost',authmidleware,async(req:Request,res:Response)=>{
    const userId=(req as any).userId;
    const post =await prisma.post.findMany({where:{
        authorId:userId
    },
   
    include:{
        comment:true,
        author:{
            select:{
               name:true,

            }
        },
        
        
    }
})
res.status(200).json(post);
})

// delete post
router.delete('/deletpost',authmidleware,async(req:Request,res:Response)=>{
    const userId=(req as any).userId;
    const {postId}=req.body;
    // here we have need to check the author of post should be same as the login user;

     const post=await prisma.post.findUnique({where:{
        id:postId
     }})
     if(!post){
        return res.status(400)
.json("post doesn't exist");     }

  if(post.authorId!==userId){
    return res.status(400).json({message:'you are not authorize to delete the post'});
  }
    await prisma.post.delete({
        where:{
            id:postId,
       
        }
    })
    res.status(200).json("post deleted successfully");
})


const postUpdateSchema=z.object({
    title:z.string().optional(),
    content:z.string().optional(),
    published:z.boolean().optional()
})
router.put('/updatePost',authmidleware,async(req:Request,res:Response)=>{
    const {postId}=req.body ;
    const userId=(req as any).userId;

    const parsedData=postUpdateSchema.parse(req.body);
    const {title,published,content}=parsedData;
    const post=await prisma.post.findUnique({
        where:{
            id:postId
        }
    })
    if(!post){
        return res.status(400).json("post does not exist");
    }

    if(post.authorId!=userId){
        return res.status(400).json("you are not authorize to update the post");
    }
   const update: any = {};
    if (title !== undefined) {
      update.title = title;
    }
    if (content !== undefined) {
      update.content = content;
    }
    if (published !== undefined) {
      update.published = published;
    }
     await prisma.post.update({
        data:update,
        where:{
            id:postId
        }
     })
     res.status(200).json('post udated successfully');

})



export default router;