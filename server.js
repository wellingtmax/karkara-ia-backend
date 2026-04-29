import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apikey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
    res.send("Backend com Gemini rodando!");
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if(!message) {
            return res.status(400).json({
                error: "Menssagem é obrigatoria.",
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: message,
        });

        res.json({
            reply: response.text,
        });
    } catch (error) {
        console.log("ERRO GEMINI:", error)

        res.status(500).json({
            error: "Erro ao conectar com o gemini.",
            details: error.message,
        })
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});