import cookieSession from "cookie-session";
import { RequestHandler } from "express";

export class CookieSessionAdapter {
  private static instance: RequestHandler;

  private constructor() {}

  public static getInstance(): RequestHandler {
    if (!CookieSessionAdapter.instance) {
      CookieSessionAdapter.instance = cookieSession({
        name: "session",
        keys: [process.env.SESSION_KEY || "default_key"], // Use an environment variable for the key
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });
    }
    return CookieSessionAdapter.instance;
  }
}
