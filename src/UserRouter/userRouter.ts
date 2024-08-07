import express,{Request,Response}from 'express';
const router=express.Router();
import { PrismaClient } from "@prisma/client";
import { useNavigate } from 'react-router-dom';


import {any, z} from 'zod';
const  bcrypt =require('bcrypt');
const  jwt =require('jsonwebtoken');
const {auth}=require('../middleware/userMiddleware')
// signup signinn update 


const prisma=new PrismaClient();
const signupSchema=z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string()

})



router.post('/signup',async (req:Request,res:Response)=>{

    const pareddata=await signupSchema.parse(req.body);

    const {name,email,password}=pareddata;


    const existinguser=await prisma.user.findUnique({
     
    where:{
        email:email
    }
    
    }   );
    if (existinguser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // hash the password
    const hashpassword=await bcrypt.hash(password,10);
    const user=await prisma.user.create({
        data:{
            name:name,
            email:email,
            password:hashpassword
        }
    })

    const {id}=user;
    const token =await jwt.sign({userId:id},process.env.jwt_secret);


    res.status(200).json({message:"account has created successfully",token:token});
    //here we will  generate the jwt token 


    



 


})


const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.get('/signin',async (req:Request,res:Response)=>{

     const parsedData = signinSchema.parse(req.body);
    const { email, password } = parsedData;
    // we will check the email exist or not if exisst then we will verify the password after verify the passsword we will generate the token key

    const existinguser=await prisma.user.findUnique({
        where:{
            email:email
        }
    })

    if(!existinguser){
       return  res.status(409).json("please enter correct input");
    }

    const verify=bcrypt.compare(password,existinguser.password);
  if(!verify){
    return res.status(409).json({message:"please enter correct passsword"});
  }

         const token =await jwt.sign({userId:existinguser.id},process.env.jwt_secret);


    res.status(200).json({message:"account has successfully logged in ",token:token});
    

      

})
// uszer can update email or password
const updateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

interface CustomRequest extends Request {
  userId?: number;
}

router.put('/update', auth, async (req: CustomRequest, res: Response) => {
  try {
    const parsedData = updateSchema.parse(req.body);
    const { email, name, password } = parsedData;

    const id = req.userId;

    if (!id) {
      return res.status(400).json({ error: 'User ID is not provided' });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateUser: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (name) {
      updateUser.name = name;
    }
    if (email) {
      updateUser.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateUser.password = hashedPassword;
    }

    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: updateUser,
    });

    res.status(200).json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;