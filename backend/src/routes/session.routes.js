import { Router } from "express";
import { listSessions, getSessionById, streamSession, uploadSession, exportSession } from "../controllers/session.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/", listSessions);
router.post("/upload", upload.single("file"), uploadSession);
router.get("/:id/stream", streamSession);
router.get("/:id/export", exportSession);
router.get("/:id", getSessionById);

export default router;

