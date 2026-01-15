import "./globals.css";

export const metadata = {
  title: "Interview Tracker",
  description: "Keep track of your career progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="main-container">
          {children}
        </main>
      </body>
    </html>
  );
}
