"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.error === "inactive-user") {
            // Sign out here
            console.log("Se hace signout"); 
            signOut();
        }
    }, [session?.error]);

    return (
        <>{children}</>
    )
}
export default ProtectedRoute;