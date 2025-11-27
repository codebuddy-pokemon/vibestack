import { NextResponse } from "next/server";
import { model, fallbackModel } from "@/lib/ai/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    // Temporarily allow unauthenticated access for testing
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

        const prompt = `
            You are a Senior UX Researcher and Cognitive Science Expert. Analyze this UI screenshot to predict user attention patterns based on visual hierarchy, contrast, and Gestalt principles.

            Identify the top 3 "Focal Points" where a user's eye will naturally land first.
            
            Return ONLY a JSON array with this exact structure:
            [
                { 
                    "x": 50, 
                    "y": 50, 
                    "label": "Primary CTA", 
                    "reason": "High contrast button with generous whitespace (Von Restorff effect)" 
                }
            ]
            
            Note: x and y should be percentages (0-100) representing the center of the focal point.
            Order them by intensity (most attention first).
        `;

        let result;
        try {
            console.log("[HEATMAP] Attempting with Gemini 2.5...");
            result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: image.type,
                    },
                },
            ]);
        } catch (primaryError) {
            console.warn("[HEATMAP] Gemini 2.5 failed, switching to fallback (Gemini 1.5 Flash)...", primaryError);
            try {
                result = await fallbackModel.generateContent([
                    prompt,
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: image.type,
                        },
                    },
                ]);
            } catch (fallbackError) {
                console.error("[HEATMAP] Fallback model also failed:", fallbackError);
                throw new Error("AI analysis failed. Please try again.");
            }
        }

        if (!result || !result.response) {
            throw new Error("No response from AI model");
        }

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
