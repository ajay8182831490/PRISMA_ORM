import express,{  Request,Response} from "express";
const router=express.Router();
const {auth}=require('../middleware/userMiddleware');
import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();
import {z} from 'zod'
// get all comment of speacific post 
// create comment 
//delete comment


router.get('/comment/:postId',async(req:Request,res:Response)=>{

    const {postId}=req.params;
    const post =await prisma.post.findUnique({
        where:{
            id:Number(postId)
        }
    })
   if(!post){
    return res.status(409).json('post does not exist')
   }

      const comments = await prisma.comment.findMany({
      where: {
        postId: Number(postId),
      },
    });

    res.status(200).json(comments);


})
const commentSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty"),
});
router.post('/comment/:postId',auth,async(req:Request,res:Response)=>{

          const {postId}=req.params;
          const userId=(req as any).userId;
     const post =await prisma.post.findUnique({
        where:{
            id  :Number(postId)
        }

        
})
if(!post){
    return res.status(409).json("post does not exist");
}


  const parsedData=commentSchema.parse(req.body);
  const {comment}=parsedData;

  await prisma.comment.create({
    data:{
        comment:comment,
        postId:Number(postId),
        userId
    }
})
res.status(200).json("comment added successfully")




})
router.delete('/deleteComment/:commentId',auth,async (req:Request,res:Response)=>{
      const userId=(req as any).userId;

      const {commentId}=req.params;

      const comment=await prisma.comment.findUnique({where:{
        id:Number(commentId)
      }})

      if(!comment){
        return res.status(400).json("comment does not exist");
      }

      await prisma.comment.delete({where:{
        id:Number(commentId)
      }})
    res.status(200).json("comment deleted successfully");

})



export default router;