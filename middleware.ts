import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}

interface JWTPayload {
    userId: string;
    role: string;
    [key: string]: any;
}

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // Block direct access to /login and /signup routes (redirect to root)
    if (pathname === "/login" || pathname.startsWith("/login/") || pathname === "/signup" || pathname.startsWith("/signup/")) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    
    // Check if accessing root or app pages
    const isAuthPage = pathname === "/" || pathname === "/app";
    
    // If user is trying to access the root/app page
    if (isAuthPage) {
        // If they have a valid token, redirect them based on their role
        if (token) {
            try {
                const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET)) as { payload: JWTPayload };
                
                // Redirect based on user role
                if (payload.role === "employee") {
                    return NextResponse.redirect(new URL("/hr1/employee/job-postings", req.url));
                } else if (payload.role === "hr1admin") {
                    return NextResponse.redirect(new URL("/hr1/admin", req.url));
                } else {
                    // Default redirect for other roles
                    return NextResponse.redirect(new URL("/hr1/employee/dashboard", req.url));
                }
            } catch (error) {
                // Token is invalid, allow access to login page
                console.error("Invalid or expired token:", error);
                // Clear the invalid token
                const response = NextResponse.next();
                response.cookies.delete("token");
                return response;
            }
        }
        // No token, allow access to root/app page
        return NextResponse.next();
    }

    // For protected routes, require valid token
    if (!token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET)) as { payload: JWTPayload };
        
        // Role-based access control
        const isAdminRoute = pathname.startsWith("/hr1/admin");
        const isEmployeeRoute = pathname.startsWith("/hr1/employee");
        
        // If admin trying to access employee routes or vice versa, redirect to their proper dashboard
        if (isAdminRoute && payload.role !== "hr1admin") {
            return NextResponse.redirect(new URL("/hr1/employee/job-postings", req.url));
        }
        
        if (isEmployeeRoute && payload.role === "hr1admin") {
            return NextResponse.redirect(new URL("/hr1/admin", req.url));
        }
        
        return NextResponse.next();
    } catch (error) {
        console.error("Invalid or expired token:", error);
        const response = NextResponse.redirect(new URL("/", req.url));
        response.cookies.delete("token");
        return response;
    }
}

export const config = {
    matcher: [
        '/',
        '/app',
        '/login/:path*',
        '/signup/:path*',
        '/hr1/login/:path*',
        '/hr1/employee/:path*',
        '/hr1/employee/my-application/:path*',
        '/hr1/employee/job-postings/:path*',
        '/hr1/employee/dashboard/:path*',
        '/hr1/admin/:path*',
        '/hr1/dashboard/:path*', 
        '/hr1/profile'
    ],
};