import { Request, Response, NextFunction } from 'express';

const  jwt =require('jsonwebtoken');

const jwt_secret="ajay"

if (!jwt_secret) {
  throw new Error('JWT_SECRET is not defined');
}

interface CustomRequest extends Request {
  userId?: number;
}

export const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const decode = jwt.verify(token, jwt_secret) as { id: number };
    req.userId = decode.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
