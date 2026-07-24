import { Bricolage_Grotesque, Quicksand } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Susana's Spa Celebration",
  description: "Susana García celebra sus 5 años — Una tarde de spa y brillo",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${bricolage.variable} ${quicksand.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen text-on-surface font-body overflow-x-hidden bg-bg">
        {children}
      </body>
    </html>
  );
}
