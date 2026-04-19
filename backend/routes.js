import express from "express";
import { submitApplication } from "./controller.js";

const router = express.Router();

router.post("/submit", submitApplication);

export default router;