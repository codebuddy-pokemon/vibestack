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
            You are an expert typographer and brand designer. Analyze this brand image (logo or product) to extract its Design System, with extreme focus on accurate font matching.

            1.  **Typography Analysis**: Look closely at the text in the image. Analyze the letterforms (serifs, terminals, x-height, weight, contrast).
            2.  **Font Matching**: Identify the exact font if possible. If not, find the **closest visual match available on Google Fonts**.
                *   For the "primary" font, choose the Google Font that best mimics the logo's typography.
                *   For the "secondary" font, choose a Google Font that pairs perfectly with the primary one (e.g., a clean sans for a decorative serif).
            3.  **Color Extraction**: Extract the dominant brand colors.

            Return ONLY a JSON object with this exact structure:
            {
                "vibe": "A short, evocative description of the brand's personality (e.g., 'Minimalist Luxury with a tech edge').",
                "colors": [
                    { "name": "Primary", "hex": "#HEXCODE", "usage": "Main brand color" },
                    { "name": "Secondary", "hex": "#HEXCODE", "usage": "Accents and highlights" },
                    { "name": "Background", "hex": "#HEXCODE", "usage": "Page background" }
                ],
                "fonts": {
                    "primary": "Name of the closest Google Font match for the main text/logo",
                    "secondary": "Name of a complementary Google Font for body text"
                }
            }
        `;

        let result;

        try {
            console.log("[BRAND_MATCH] Attempting with Gemini 2.5...");
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
            console.warn("[BRAND_MATCH] Gemini 2.5 failed, switching to fallback (Gemini 1.5 Flash)...", primaryError);
            result = await fallbackModel.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: image.type,
                    },
                },
            ]);
        }

        const response = result.response;
        const text = response.text();
        console.log("[BRAND_MATCH_RAW_RESPONSE]", text);

        // Clean up the response to ensure it's valid JSON
        const jsonStr = text.replace(/```json\n|\n```/g, "").trim();

        try {
            const data = JSON.parse(jsonStr);
            return NextResponse.json(data);
        } catch (parseError) {
            console.error("[BRAND_MATCH_PARSE_ERROR]", parseError);
            console.error("Failed JSON String:", jsonStr);
            return new NextResponse("Failed to parse AI response", { status: 500 });
        }
    } catch (error: any) {
        console.error("[BRAND_MATCH_ERROR]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
