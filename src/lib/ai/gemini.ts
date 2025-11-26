import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  console.warn("GOOGLE_GENERATIVE_AI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

function fileToGenerativePart(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function generateWithRetry(model: any, parts: any[]) {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await model.generateContent(parts);
    } catch (error: any) {
      if (error.message?.includes("503") || error.message?.includes("Overloaded")) {
        console.warn(`Gemini 503 Error (Attempt ${i + 1}/${MAX_RETRIES}). Retrying in ${RETRY_DELAY * (i + 1)}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Gemini API is overloaded after multiple retries.");
}

export async function generateLandingPage(prompt: string, imageBuffer?: Buffer, mimeType?: string, style?: string) {
  const systemPrompt = `
    You are an expert web designer and frontend developer. Generate a production-ready landing page based on this description.
    
    DESCRIPTION: ${prompt}
    ${style ? `STYLE: ${style}` : ""}
    
    Return ONLY valid JSON in this exact format:
    {
      "html": "<!DOCTYPE html>...",
      "css": "body { ... }"
    }

  Rules:
  1. The HTML should be a complete single - page landing page with a hero, features, and footer.
    2. Use semantic HTML5.
    3. The CSS should be modern, responsive, and visually stunning(Neo - Brutalism or Modern Clean).
    4. Do NOT use external CSS frameworks like Tailwind in the CSS property; write raw CSS or use a CDN link in the HTML head if absolutely necessary, but preferably raw CSS for the 'css' field.
    5. Ensure the design "passes the vibe check" - unique, bold, and professional.
  `;


  try {
    const parts: any[] = [systemPrompt];
    if (imageBuffer && mimeType) {
      parts.push(fileToGenerativePart(imageBuffer, mimeType));
      parts.push("Use this image as a reference for the layout and design.");
    }

    const result = await generateWithRetry(model, parts);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini Raw Response:", text);

    // Extract JSON from markdown code block if present
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;

    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Failed to generate valid JSON");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}

export async function roastPage(imageBuffer: Buffer, mimeType: string) {
  const prompt = `
      You are a brutal design critic. Roast this landing page design.
      Be funny, harsh, but constructive. Focus on:
      - Typography choices
      - Color palette
      - Spacing and layout
      - "Vibe"
  
      Return a JSON object:
      {
        "roast": "Your roast here...",
        "score": 42, // 0-100
        "improvements": ["Fix this", "Change that"]
      }
    `;

  try {
    const result = await generateWithRetry(model, [
      prompt,
      fileToGenerativePart(imageBuffer, mimeType)
    ]);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Roast Error:", error);
    throw error;
  }
}

export async function getVibeScore(imageBuffer: Buffer, mimeType: string) {
  const prompt = `
        Analyze the "vibe" of this website design.
        Return a JSON object:
        {
          "score": 85, // 0-100
          "vibe": "Cyberpunk Minimalist",
          "explanation": "Why it has this vibe..."
        }
      `;

  try {
    const result = await generateWithRetry(model, [
      prompt,
      fileToGenerativePart(imageBuffer, mimeType)
    ]);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Vibe Score Error:", error);
    throw error;
  }
}

export async function generateRemix(html: string, instruction: string) {
  const prompt = `
        You are a World-Class UI/UX Designer and Creative Director.
        Your goal is to completely reimagine the design of the following HTML component based on this instruction: "${instruction}".
        
        HTML:
        ${html}

        Rules:
        1. BE BOLD. Do not just tweak the padding or colors. Change the layout, typography, and visual hierarchy significantly.
        2. Use modern design trends: Glassmorphism, Neo-Brutalism, Bento Grids, Asymmetry, or whatever fits the "vibe".
        3. Return ONLY the new HTML for this component.
        4. Do NOT wrap it in \`\`\`html code blocks.
        5. Keep the content (text/images) mostly the same, but feel free to re-order or re-structure it for better impact.
        6. Use Tailwind CSS classes.
        7. Do not include <html>, <head>, or <body> tags, just the component itself.
        8. If the instruction implies a specific style (e.g. "dark mode", "playful"), go all in on that style.
      `;

  try {
    const result = await generateWithRetry(model, [prompt]);
    const response = await result.response;
    let text = response.text();

    // Clean up markdown if present
    text = text.replace(/```html/g, "").replace(/```/g, "").trim();

    return { html: text };
  } catch (error) {
    console.error("Remix Error:", error);
    throw error;
  }
}

export async function improveCopy(text: string, instruction: string) {
  const prompt = `
        You are a world-class copywriter and conversion rate optimization expert.
        Your goal is to rewrite the provided text to be more persuasive, punchy, and conversion-focused, based on the user's instruction.
        
        Original Text: "${text}"
        Instruction: ${instruction || "Make it more persuasive and punchy."}

        Rules:
        1. Keep the length similar to the original text (unless instructed otherwise).
        2. Maintain the original meaning but improve the clarity and impact.
        3. Do NOT add any markdown formatting (no bold, italics, etc.) unless explicitly asked.
        4. Return ONLY the rewritten text, no explanations.
        5. If the text is a button label, keep it short and action-oriented.
        6. If the text is a headline, make it catchy and benefit-driven.

        Return a JSON object:
        {
            "text": "Your rewritten text here"
        }
    `;

  try {
    const result = await generateWithRetry(model, [prompt]);
    const response = await result.response;
    const responseText = response.text();

    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : responseText;

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Copy Improvement Error:", error);
    throw error;
  }
}
