import generateContent from "../service/ai.js";
import { v4 as uuidv4 } from 'uuid';
import ChatSession from "../models/chat.js";
import mongoose from "mongoose";

export const getRevert = async (req, res) => {
    const { userId, email, message } = req.body;
    try {
        let session = await ChatSession.findOne({userId}).sort({createdAt: -1})
        if(!session || session.chat.length >= 10) {
            session = new ChatSession({
                email,
                userId,
                sessionId: uuidv4(),
                chat: []
            })
        }

        session.chat.push({role: "user", content: message})
        const response = await generateContent(session.chat);
        session.chat.push({role: 'ai', content: response})
        await session.save()
        res.status(200).json({ response });
    } catch (error) {
        console.error("AI Error:", error.message, error.stack);
    res.status(500).json({ error: 'Failed to handle message', details: error.message });
    }
}

export const getChat = async (req, res) => {
    try {
      const { userId } = req.body;
      console.log(userId);
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
  
      const sessions = await ChatSession.find({ userId }).sort({ createdAt: 1 });
  
      // Combine all chats from all sessions
      const allMessages = sessions.flatMap(session => session.chat.map(msg => ({
        role: msg.role,
        message: msg.content,
        })));
  
      res.status(200).json(allMessages);
    } catch (error) {
      console.error("Error fetching history:", error.message);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  };
  

export const clearChat = async (req, res) => {
  try {
    const { userId } = req.body;
    await ChatSession.findOneAndUpdate({ userId }, {chat: []});
    res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    console.error("Error clearing chat:", error.message);
    res.status(500).json({ error: "Failed to clear chat" });
  }
}