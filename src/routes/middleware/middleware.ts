import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { MY_SECRET_KEY } from "../../../key";

export const validateData =
  (schema: z.ZodObject<any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.format();
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }
    req.body = result.data;
    next();
  };

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      message: "Token Required",
    });
  }
  jwt.verify(token, MY_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token",
      });
    }
    (req as any).user = user;
    next();
  });
};
