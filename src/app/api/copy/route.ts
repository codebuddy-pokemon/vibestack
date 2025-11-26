import { improveCopy } from "@/lib/ai/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text, instruction } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const result = await improveCopy(text, instruction);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Copy improvement failed:", error);
        return NextResponse.json({ error: "Failed to improve copy" }, { status: 500 });
    }
}
