import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes";
import bodyParser from "body-parser";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 2000;

app.use(bodyParser.json());
app.use("/api/", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + Typescript ");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
