import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await params

        const project = await prisma.project.findUnique({
            where: {
                id,
                userId: session.user.id,
            },
        })

        if (!project) {
            return new NextResponse("Project not found", { status: 404 })
        }

        return NextResponse.json(project)
    } catch (error) {
        console.error("[PROJECT_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await params
        const body = await req.json()
        const { name, description, html, css, metadata, vibeScore, styleType, isPublic, deployed } = body

        const project = await prisma.project.update({
            where: {
                id,
                userId: session.user.id,
            },
            data: {
                name,
                description,
                html,
                css,
                metadata,
                vibeScore,
                styleType,
                isPublic,
                deployed,
            },
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error("[PROJECT_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await params

        const project = await prisma.project.delete({
            where: {
                id,
                userId: session.user.id,
            },
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error("[PROJECT_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
