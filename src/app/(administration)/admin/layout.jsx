import SidebarAdmin from "../../../components/trabaja-con-nosotros-admin/sidebar-admin";
import ProtectedRoute from "../../../components/authentication/protected-route";
import config from "../../../constants/sidebar-home-config";
import { AdminContextProvider } from "../../../context/admin-context";
import SessionAuthProvider from "../../../context/session-auth-provider";

export const metadata = {
  title: "Admin Home",
  description: "Inova Solutions - Admin Home",
};

export default function RootLayout({ children }) {
  return (
    <SessionAuthProvider>
      <ProtectedRoute>
        <AdminContextProvider>
          <SidebarAdmin config={config}>{children}</SidebarAdmin>
        </AdminContextProvider>
      </ProtectedRoute>
    </SessionAuthProvider>
  );
}
