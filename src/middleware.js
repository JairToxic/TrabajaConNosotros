export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/home/:path*",
    "/admin/:path*",
    "/home/:path*",
    "/empresa/:path*",
    "/servicios/:path*",
    "/gestion/:path*",
  ],
};
