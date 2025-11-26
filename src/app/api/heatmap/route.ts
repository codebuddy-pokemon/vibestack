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
            Analyze this UI screenshot and predict the top 3 areas that will capture user attention (focal points).
            Return ONLY a JSON array with this exact structure:
            [
                { 
                    "x": 50, 
                    "y": 50, 
                    "label": "Headline", 
                    "reason": "High contrast and large typography" 
                }
            ]
            
            Note: x and y should be percentages (0-100) representing the center of the focal point.
            Order them by intensity (most attention first).
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
        console.log("[HEATMAP_RAW_RESPONSE]", text);

        // Robust JSON extraction
        let jsonStr = text.trim();

        const firstBracket = jsonStr.indexOf("[");
        const lastBracket = jsonStr.lastIndexOf("]");

        if (firstBracket !== -1 && lastBracket !== -1) {
            jsonStr = jsonStr.substring(firstBracket, lastBracket + 1);
        } else {
            // Fallback: try to find markdown block if brackets aren't obvious
            const match = jsonStr.match(/```(?:json)?([\s\S]*)```/);
            if (match) {
                jsonStr = match[1].trim();
            }
        }

        try {
            const data = JSON.parse(jsonStr);
            return NextResponse.json(data);
        } catch (parseError) {
            console.error("[HEATMAP_PARSE_ERROR]", parseError, "Raw text:", text);
            return new NextResponse(`Failed to parse AI response: ${text.substring(0, 100)}...`, { status: 500 });
        }
    } catch (error: any) {
        console.error("[HEATMAP_ERROR]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
