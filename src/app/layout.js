import ProtectedRoute from "../components/authentication/protected-route";
import "./globals.css";
import SessionAuthProvider from "../context/session-auth-provider";

export const metadata = {
  title: "Inova Solutions",
  description: "Your passport to cloud",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionAuthProvider>
          <ProtectedRoute>
          {children}
          </ProtectedRoute>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
