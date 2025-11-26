import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session && process.env.NODE_ENV !== "development") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const formData = await req.formData();
        const image = formData.get("image") as File;

        if (!image) {
            return new NextResponse("Image is required", { status: 400 });
        }

        const buffer = Buffer.from(await image.arrayBuffer());
        const base64Image = buffer.toString("base64");

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

        const prompt = `
            Analyze this brand image (logo or product) and extract its Design System.
            Return ONLY a JSON object with this exact structure:
            {
                "vibe": "A short, evocative description of the brand's personality (e.g., 'Minimalist Luxury with a tech edge').",
                "colors": [
                    { "name": "Primary", "hex": "#HEXCODE", "usage": "Main brand color" },
                    { "name": "Secondary", "hex": "#HEXCODE", "usage": "Accents and highlights" },
                    { "name": "Background", "hex": "#HEXCODE", "usage": "Page background" }
                ],
                "fonts": {
                    "primary": "Name of a matching Google Font for Headings (e.g., Inter, Playfair Display)",
                    "secondary": "Name of a matching Google Font for Body text (e.g., Roboto, Lora)"
                }
            }
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: image.type,
                },
            },
        ]);

        const response = result.response;
        const text = response.text();

        // Clean up the response to ensure it's valid JSON
        const jsonStr = text.replace(/```json\n|\n```/g, "").trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);
    } catch (error) {
        console.error("[BRAND_MATCH_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
