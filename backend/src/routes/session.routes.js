import { Router } from "express";
import { listSessions, getSessionById, streamSession } from "../controllers/session.controller.js";

const router = Router();

router.get("/", listSessions);
router.get("/:id/stream", streamSession);
router.get("/:id", getSessionById);

export default router;