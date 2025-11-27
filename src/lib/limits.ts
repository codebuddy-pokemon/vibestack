import { prisma } from "@/lib/db";

export const MAX_FREE_PROJECTS = 3;

export async function checkUsageLimit(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true }
    });

    if (!user || user.plan === "PRO" || user.plan === "AGENCY") {
        return true;
    }

    // It's a FREE user
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const count = await prisma.project.count({
        where: {
            userId: userId,
            createdAt: {
                gte: firstDayOfMonth
            }
        }
    });

    return count < MAX_FREE_PROJECTS;
}

export async function getUsageCount(userId: string): Promise<number> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const count = await prisma.project.count({
        where: {
            userId: userId,
            createdAt: {
                gte: firstDayOfMonth
            }
        }
    });

    return count;
}
