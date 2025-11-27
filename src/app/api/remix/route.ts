import { NextResponse } from "next/server";
import { generateRemix } from "@/lib/ai/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    // Temporarily allow unauthenticated access for testing
    if (!session && process.env.NODE_ENV !== "development") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check usage limits
    if (session?.user?.id) {
        const { checkUsageLimit } = await import("@/lib/limits");
        const allowed = await checkUsageLimit(session.user.id);
        if (!allowed) {
            return NextResponse.json(
                { error: "You have reached your free limit of 3 projects per month. Please upgrade to Pro for unlimited access.", upgrade: true },
                { status: 403 }
            );
        }
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
