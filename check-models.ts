import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API key found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName: string) {
    console.log(`Testing model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log(`✅ ${modelName} Success:`, response.text());
        return true;
    } catch (error: any) {
        console.error(`❌ ${modelName} Failed:`, error.message);
        return false;
    }
}

async function listModels() {
    console.log("Listing available models...");
    try {
        // @ts-ignore
        const modelList = await genAI.makeRequest("models", { pageSize: 100 });
        // This might not work directly as makeRequest is internal or different in SDK versions
        // Let's try a different approach if the SDK exposes listModels
        // Actually the SDK doesn't expose listModels easily on the instance.
        // We'll try to just test 'gemini-pro' which is often the legacy name or 'gemini-1.0-pro'
    } catch (e) {
        console.log("List models failed");
    }
}

async function run() {
    console.log("Starting model verification...");

    // Test Gemini 2.5 (Primary) - We know this works
    // await testModel("gemini-2.5-flash-preview-09-2025");

    // Test Gemini 1.5 Flash 8B
    await testModel("gemini-1.5-flash-8b");

    // Test Gemini 1.5 Pro Latest (used previously)
    await testModel("gemini-1.5-pro-latest");

    // Test Gemini 1.5 Flash 002 again just in case
    await testModel("gemini-1.5-flash-002");
}

run();
