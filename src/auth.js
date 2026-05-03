import express from "express";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db } from "./db/index.js";
import { usersTable } from "./db/schema.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, firstName } = req.body;

  if (!email || !password || !firstName) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const hashed = await bcrypt.hash(password, 10);

  try {
    await db.insert(usersTable).values({
      email,
      password: hashed,
      firstName,
    });

    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ message: "User already exists" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

export default router;