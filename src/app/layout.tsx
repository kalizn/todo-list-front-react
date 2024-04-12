import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "src/utils/SessionProvider";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Lista de Tarefas",
  description: "Desafio Encibra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <SessionProvider>
      <html lang="pt-br">
        <body className={inter.className}>{children}</body>
      </html>
    </SessionProvider>

  );
}
