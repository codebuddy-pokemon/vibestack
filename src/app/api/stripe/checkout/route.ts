import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

// You should set this in your .env.local
const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!PRO_PRICE_ID) {
            return NextResponse.json({ error: "Stripe Price ID not configured" }, { status: 500 });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            success_url: `${process.env.NEXTAUTH_URL}/settings?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: session.user.email,
            line_items: [
                {
                    price: PRO_PRICE_ID,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: session.user.id,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("[STRIPE_CHECKOUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
