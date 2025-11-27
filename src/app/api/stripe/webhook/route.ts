import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        if (!session?.metadata?.userId) {
            return new NextResponse("User ID is missing in session metadata", { status: 400 });
        }

        await prisma.user.update({
            where: {
                id: session.metadata.userId,
            },
            data: {
                plan: "PRO",
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
            },
        });
    }

    return new NextResponse(null, { status: 200 });
}
