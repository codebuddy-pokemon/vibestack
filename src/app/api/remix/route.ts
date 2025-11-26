import { NextResponse } from "next/server";
import { generateRemix } from "@/lib/ai/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session && process.env.NODE_ENV !== "development") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { html, instruction } = await req.json();

        if (!html || !instruction) {
            return new NextResponse("HTML and instruction are required", { status: 400 });
        }

        const data = await generateRemix(html, instruction);

        return NextResponse.json(data);
    } catch (error) {
        console.error("[REMIX_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
