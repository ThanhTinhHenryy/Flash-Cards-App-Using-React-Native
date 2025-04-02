import express, { Request, Response, RequestHandler } from "express";
import dotenv from "dotenv";
import { getXataClient } from "./xata";
import { cardsCapitals, cardsProgramming, sets } from "./seed_database";

dotenv.config();
// * Cau hinh port tu file .env || PORT = 3000
const PORT = process.env.PORT || 3000;

// console.log(process.env.XATA_API_KEY);

const app = express();
app.use(express.json({ limit: "50mb" }));

const client = getXataClient();

// * Khoi tao seedDB
app.get("/init", async (req: Request, res: Response) => {
  const seedSets = sets;
  const seedCardsCapitals = cardsCapitals;
  const seedCardsProgramming = cardsProgramming;

  await client.db.sets.create(seedSets);
  await client.db.cards.create(seedCardsCapitals); //flcard thu do
  await client.db.cards.create(seedCardsProgramming); // flcard lap trinh

  res.json({ results: "ok" });
});

// * Get tat ca sets
app.get("/sets", (async (req: Request, res: Response) => {
  const sets = await client.db.sets
    .select(["xata_id", "title", "description", "image", "cards"])
    .filter({ private: false })
    .getAll();
  res.json(sets);
}) as RequestHandler);

// * Get sets theo id
app.get("/sets/:id", (async (req: Request, res: Response) => {
  const { id } = req.params;
  const set = await client.db.sets.read(id);
  res.json(set);
}) as RequestHandler);

app.listen(PORT, () => {
  console.log(`Đang lắng nghe trên cổng: ${PORT}`);
});
