require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log("--- Gemini Diagnostic Test ---");
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("ERROR: GEMINI_API_KEY is missing in process.env");
        return;
    }
    console.log(`API Key present: ${!!key}`);
    console.log(`API Key starts with: ${key.substring(0, 4)}...`);
    console.log(`API Key ends with: ...${key.substring(key.length - 4)}`);

    try {
        const genAI = new GoogleGenerativeAI(key.trim());

        // 1. List Models (if supported by SDK version, usually via specific client)
        // The generic SDK might not expose listModels directly on genAI instance easily in older versions, 
        // but typically it's NOT on the main class in all versions. 
        // However, we can try a simple generation which is the real test.

        console.log("\nTesting Model: gemini-1.5-flash");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("Hello, are you working?");
            const response = await result.response;
            console.log("SUCCESS: gemini-1.5-flash response:", response.text());
        } catch (e) {
            console.error("FAILED: gemini-1.5-flash error:", e.message);
        }

        console.log("\nTesting Model: gemini-pro");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Hello, are you working?");
            const response = await result.response;
            console.log("SUCCESS: gemini-pro response:", response.text());
        } catch (e) {
            console.error("FAILED: gemini-pro error:", e.message);
        }

    } catch (error) {
        console.error("Global Error:", error);
    }
}

testGemini();
