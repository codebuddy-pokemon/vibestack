import { NextResponse } from "next/server";
import { getVibeScore } from "@/lib/ai/gemini";
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
        const mimeType = image.type;

        const data = await getVibeScore(buffer, mimeType);

        return NextResponse.json(data);
    } catch (error) {
        console.error("[VIBE_SCORE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
