import { NextResponse } from "next/server";
import { generateLandingPage } from "@/lib/ai/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    console.log("[API] /api/generate/from-text called");

    try {
        const session = await getServerSession(authOptions);
        console.log("[API] Session:", session ? "Authenticated" : "No Session");

        // Temporarily allow unauthenticated access for testing
        // TODO: Re-enable auth in production
        // if (!session && process.env.NODE_ENV !== "development") {
        //     console.log("[API] Unauthorized access attempt");
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const { prompt, style } = await req.json();
        console.log("[API] Received prompt:", prompt?.substring(0, 100));
        console.log("[API] Received style:", style);

        if (!prompt) {
            console.error("[API] Missing prompt");
            return new NextResponse("Prompt is required", { status: 400 });
        }

        console.log("[API] Calling generateLandingPage...");
        const data = await generateLandingPage(prompt, undefined, undefined, style);
        console.log("[API] Generation successful");

        return NextResponse.json(data);
    } catch (error) {
        console.error("[GENERATE_ERROR] Detailed error:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            return NextResponse.json(
                { error: error.message, details: error.stack },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: "Internal Error" },
            { status: 500 }
        );
    }
}
