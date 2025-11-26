import { NextResponse } from "next/server";
import { generateLandingPage } from "@/lib/ai/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    console.log("[API] /api/generate/from-text called");
    const session = await getServerSession(authOptions);
    console.log("[API] Session:", session ? "Authenticated" : "No Session");

    // Skip auth in development for testing
    if (!session && process.env.NODE_ENV !== "development") {
        console.log("[API] Unauthorized access attempt");
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { prompt, style } = await req.json();

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }

        const data = await generateLandingPage(prompt, undefined, undefined, style);

        return NextResponse.json(data);
    } catch (error) {
        console.error("[GENERATE_ERROR] Detailed error:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        return new NextResponse("Internal Error", { status: 500 });
    }
}
