import express, { type Request, type Response } from "express";
import cors from "cors";
import { prisma } from "./lib/prismaClient.js";
import "dotenv/config";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.get("/", (_req: Request, res: Response) => {
  res.send(`<h1> Hello World </h1>`);
});
app.get("/api/list", async (_req: Request, res: Response) => {
  const list = await prisma.list.findMany();
  res.status(200).json(list);
});
app.post("/api/list", async (req: Request, res: Response) => {
  const result = req.body as { item: string };
  const newItem = await prisma.list.create({
    data: {
      item: result.item,
    },
  });
  console.log(result);
  res.status(201).json(newItem);
});
app.delete("/api/list/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const item = await prisma.list.findUnique({
    where: { id },
  });
  if (!item) return res.status(400).json({ error: "Item not in system" });
  await prisma.list.delete({
    where: { id: item.id },
  });
  res.status(200).json(item);
});
//--------------Server Setup---------------------
const port = process.env.PORT || 3000;

const env = process.env.NODE_ENV || "development";

app.listen(port, () => {
  console.log(`Server is running in ${env} Environment`);
  console.log(`Server is Listening on Port ${port}`);
});
