import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { getXataClient } from "./xata";

dotenv.config();
// * Cau hinh port tu file .env || PORT = 3000
const PORT = process.env.PORT || 3000;

// console.log(process.env.XATA_API_KEY);

const app = express();
app.use(express.json({ limit: "50mb" }));

const client = getXataClient();

app.get("/", async (req: Request, res: Response) => {
  const result = await client.db.sets.getAll();
  res.json({ results: result });
});
app.listen(PORT, () => {
  console.log(`Đang lắng nghe trên cổng: ${PORT}`);
});
