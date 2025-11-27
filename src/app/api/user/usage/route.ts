import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUsageCount, MAX_FREE_PROJECTS } from "@/lib/limits";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { plan: true }
        });

        const usage = await getUsageCount(session.user.id);

        return NextResponse.json({
            plan: user?.plan || "FREE",
            usage: usage,
            limit: MAX_FREE_PROJECTS
        });
    } catch (error) {
        console.error("[USAGE_API_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
