import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        // Skip auth in development
        if (!session && process.env.NODE_ENV !== "development") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { name, description, inputType, inputData, html, css, metadata, vibeScore, styleType } = body

        // Use session user ID or dummy ID in dev mode
        const userId = session?.user?.id || "dev-user-id"

        const project = await prisma.project.create({
            data: {
                userId,
                name,
                description,
                inputType,
                inputData,
                html,
                css,
                metadata,
                vibeScore,
                styleType,
            },
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error("[PROJECTS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const projects = await prisma.project.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json(projects)
    } catch (error) {
        console.error("[PROJECTS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
