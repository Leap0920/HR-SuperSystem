// ==========================================
// 3. lib/auth.ts - Authentication Utilities
// ==========================================
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRE = "7d";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

// Create JWT Token
export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
}

// Verify JWT Token
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

// Get token from request
export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return null;
}

// Middleware to verify auth
export async function authMiddleware(req: NextRequest) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return {
      authenticated: false,
      user: null,
      error: "No token provided",
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return {
      authenticated: false,
      user: null,
      error: "Invalid token",
    };
  }

  return {
    authenticated: true,
    user: payload,
    error: null,
  };
}