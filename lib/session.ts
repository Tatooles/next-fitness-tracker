import { SessionOptions } from "iron-session";

export interface SessionData {
  userId: number;
  username: string;
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "fitness-tracker-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  },
};

export const defaultSession: SessionData = {
  userId: 0,
  username: "",
  isLoggedIn: false,
};