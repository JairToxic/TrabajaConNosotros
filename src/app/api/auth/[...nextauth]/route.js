import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        return axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
            {
              username: credentials.username,
              password: credentials.password,
            },
            {
              headers: {
                Authorization: "7zXnBjF5PBl7EzG/WhATQw==", // Authorization header
                "Content-Type": "application/json", // Content-Type header added here
              },
            }
          )
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.log(error.response);
            throw new Error(error.response.data.message);
          }) || null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Si es la primera vez que se genera el token (usuario recién autenticado)
      if (user) {
        token.accessToken = user.token; // Guardar el token del usuario
        token.expiresAt = Date.now() + 2 * 60 * 60 * 1000; // Expira en 2 horas
      }

      return {...token, ...user};
    },
    async session({ session, token }) {
      // Pasar el token de acceso y la fecha de expiración a la sesión
      session.user = token;
      session.expires = new Date(token.expiresAt).toISOString(); // convertir a ISO
      // Verificar si el token ha expirado
      if (Date.now() > token.expiresAt) {
        // Si ha expirado, retornar una sesión no válida
        session.error = "inactive-user"; // Esto hará que la sesión se considere no autenticada
      }
      return session;
    },
  },
  pages: {
    signIn: `${process.env.NEXT_URL_LOGIN}/login`,
  },
});

export { handler as GET, handler as POST };
