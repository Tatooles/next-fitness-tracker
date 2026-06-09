import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, defaultSession, type SessionData } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions,
    );

    if (!session.isLoggedIn) {
      return NextResponse.json(defaultSession);
    }

    return NextResponse.json({
      userId: session.userId,
      username: session.username,
      isLoggedIn: session.isLoggedIn,
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}