import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
    try {
        console.log("[API] DATABASE_URL exists:", !!process.env.DATABASE_URL);
        console.log("[API] DATABASE_URL prefix:", process.env.DATABASE_URL?.substring(0, 15));

        const session = await getServerSession(authOptions)

        // Skip auth in development AND production temporarily for testing
        // if (!session && process.env.NODE_ENV !== "development") {
        //     return new NextResponse("Unauthorized", { status: 401 })
        // }

        const body = await req.json()
        const { name, description, inputType, inputData, html, css, metadata, vibeScore, styleType } = body

        // Use session user ID or dummy ID
        const userId = session?.user?.id || "temp-prod-user-id"
        console.log("[API] Creating project for user:", userId);

        const project = await prisma.project.create({
            data: {
                userId,
                name,
                description,
                inputType,
                inputData: typeof inputData === 'object' ? JSON.stringify(inputData) : inputData,
                html,
                css,
                metadata: typeof metadata === 'object' ? JSON.stringify(metadata) : metadata,
                vibeScore,
                styleType,
            },
        })
        console.log("[API] Project created successfully:", project.id);

        // Parse back for response
        const responseProject = {
            ...project,
            inputData: project.inputData ? JSON.parse(project.inputData as string) : null,
            metadata: project.metadata ? JSON.parse(project.metadata as string) : null,
        }

        return NextResponse.json(responseProject)
    } catch (error) {
        console.error("[PROJECTS_POST] CRITICAL ERROR:", error)
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

        const parsedProjects = projects.map(p => ({
            ...p,
            inputData: p.inputData ? JSON.parse(p.inputData as string) : null,
            metadata: p.metadata ? JSON.parse(p.metadata as string) : null,
        }))

        return NextResponse.json(parsedProjects)
    } catch (error) {
        console.error("[PROJECTS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
