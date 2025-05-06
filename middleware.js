import { NextResponse } from "next/server";

export function middleware(request) {
  // Check for admin authentication cookie specifically
  const isAdminAuthenticated = request.cookies.get("isAuthenticated");
  const { pathname } = request.nextUrl;

  // Define admin routes that should be protected
  const adminRoutes = [
    "/dashboard",
    "/add-service",
    "/service-providers",
    "/agents",
    "/bookings",
    "/banners",
    "/feedback",
    "/notifications",
    "/users"
  ];

  // Check if current path is an admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // If trying to access any admin route without admin authentication
  if (isAdminRoute && !isAdminAuthenticated) {
    // Redirect to login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If authenticated as admin and trying to access login page
  if (pathname === "/login" && isAdminAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/login",
    "/add-service/:path*",
    "/service-providers/:path*",
    "/agents/:path*",
    "/bookings/:path*",
    "/banners/:path*",
    "/feedback/:path*",
    "/notifications/:path*",
    "/users/:path*"
  ],
}; 