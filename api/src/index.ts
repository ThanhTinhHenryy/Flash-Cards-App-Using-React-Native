import express, { Request, Response } from "express";

import dotenv from "dotenv";

dotenv.config();
// * Cau hinh port tu file .env || PORT = 3000
const PORT = process.env.PORT || 3000;

const app = express();
app.get("/", (req: Request, res: Response) => {
  res.json({ ThanhTinh: true });
});
app.listen(PORT, () => {
  console.log(`Đang lắng nghe trên cổng: ${PORT}`);
});
