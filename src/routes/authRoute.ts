// Import required modules
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt, { hash } from "bcryptjs";
import { AccountType, SigninType } from "../types";

const authRoute = express.Router();
const prisma = new PrismaClient();

authRoute.post("/signup", async (req, res) => {
  try {
    const values: AccountType = req.body;

    const existingUser = await prisma.account.findUnique({
      where: { email: values.email },
    });

    if (existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const hashedPassword = await bcrypt.hash(values.password, 10);

    const newUser = await prisma.account.create({
      data: {
        email: values.email,
        firstName: values.firstName,
        lastName: values.firstName,
        password: hashedPassword,
      },
    });

    if (newUser) {
      return res.status(200).json({
        message: `Account Created Successfully.`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

authRoute.post("/signin", async (req, res) => {
  try {
    const values: SigninType = req.body;

    const existingUser = await prisma.account.findUnique({
      where: { email: values.email },
    });

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      values.password,
      existingUser.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "Sign-in successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default authRoute;