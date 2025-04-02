import express, { application } from "express";
import dotenv from "dotenv";
dotenv.config();

// * Cau hinh port tu file .env || PORT = 3000
const { PORT } = process.env || 3000;

const app = express();
app.listen(PORT, () => {
  console.log(`Đang lắng nghe trên cổng: ${PORT}`);
});
