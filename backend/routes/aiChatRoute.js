import express from "express";
import { clearChat, getChat, getRevert } from "../controller/aiController.js";

const router = express.Router() 

router.post('/chat', getRevert)
router.post('/chat/history', getChat)
router.post('/chat/clear', clearChat)

export default router;