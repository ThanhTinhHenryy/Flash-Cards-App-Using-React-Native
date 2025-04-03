import express, { Request, Response, RequestHandler } from "express";
import dotenv from "dotenv";
import { getXataClient, SetsRecord } from "./xata";
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

// * Get set theo id
app.get("/sets/:id", (async (req: Request, res: Response) => {
  const { id } = req.params;
  const set = await client.db.sets
    .select(["xata_id", "title", "description", "image", "cards", "creator"])
    .filter({ xata_id: id })
    .getFirst();

  if (!set) {
    return res.status(404).json({ error: "Set not found" });
  }

  res.json(set);
}) as RequestHandler);

// * Tao set
app.post("/sets", (async (req: Request, res: Response) => {
  const { title, description, private: isPrivate, creator, image } = req.body;
  const set = await client.db.sets.create({
    title,
    description,
    private: isPrivate,
    creator,
    image: image
      ? { base64Content: image, mediaType: "image/png", enablePublicUrl: true }
      : null,
  });

  console.log("set: ", set);
  res.json(set);
}) as RequestHandler);

// * Them set vao fav cua user
app.post("/usersets", (async (req: Request, res: Response) => {
  const { user, set } = req.body;
  const userSet = await client.db.user_sets.create({
    user,
    set,
  });
  res.json(userSet);
}) as RequestHandler);

// * Lay tat ca sets cua user
app.get("/usersets", (async (req: Request, res: Response) => {
  const { user } = req.query;

  const sets = await client.db.user_sets
    .select(["xata_id", "set.*"])
    .filter({ user: `${user}` })
    .getAll();
  res.json(sets);
}) as RequestHandler);

// * Xoa set theo id
const deleteSetHandler: express.RequestHandler = async (req, res) => {
  const { id } = req.params;

  // Lay danh sach user_sets lien quan
  const existingSets = await client.db.user_sets.filter({ set: id }).getAll();

  if (existingSets.length > 0) {
    // Lấy danh sách xata_id cần xóa
    const toDelete = existingSets.map((set) => set.xata_id);
    await client.db.user_sets.delete(toDelete);
  }
  await client.db.sets.delete(id);

  res.json({ success: true });
};

// * route del
app.delete("/sets/:id", deleteSetHandler);

// * +++++++++++++++++CARDs+++++++++++++++++++++

// * Tao card moi
app.post("/cards", (async (req, res) => {
  const { set, question, answer } = req.body;
  const card = await client.db.cards.create({
    set,
    question,
    answer,
  });

  if (card) {
    await client.db.sets.update(set, {
      cards: {
        $increment: 1,
      },
    });
  }
  res.json(card);
}) as RequestHandler);

// * Lay tat ca cards cua 1 set
app.get("/cards", (async (req, res) => {
  const { setid } = req.query;
  const cards = await client.db.cards
    .select(["*", "set.*"])
    .filter({ set: setid })
    .getAll();
  res.json(cards);
}) as RequestHandler);

// * API này cho phép người dùng lấy một số lượng thẻ học ngẫu nhiên từ một set thẻ cụ thể.
app.get("/cards/learn", (async (req, res) => {
  const { setid, limit } = req.query;

  const cards = await client.db.cards
    .select(["question", "answer", "image"])
    .filter({ set: setid })
    .getAll();

  // * Get a random set of cards using limit: Người dùng có thể chỉ định số lượng thẻ muốn học thông qua tham số limit.
  const randomCards = cards
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .slice(0, +limit!);

  res.json(randomCards);
}) as RequestHandler);

// * Tao learning progress
app.post("/learnings", (async (req, res) => {
  const { user, set, cardsTotal, correct, wrong } = req.body;
  const obj = {
    user,
    set,
    cards_total: +cardsTotal,
    cards_correct: +correct,
    cards_wrong: +wrong,
    score: (+correct / +cardsTotal) * 100,
  };
  const learning = await client.db.learning.create(obj);
  res.json(learning);
}) as RequestHandler);

// * Lay tat ca progress learning
app.get("/learnings", (async (req, res) => {
  const { user } = req.query;
  const learnings = await client.db.learning
    .select(["*", "set.*"])
    .filter({ user: `${user}` })
    .getAll();
  res.json(learnings);
}) as RequestHandler);

app.listen(PORT, () => {
  console.log(`Đang lắng nghe trên cổng: ${PORT}`);
});
