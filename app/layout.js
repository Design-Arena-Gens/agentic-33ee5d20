import "./globals.css";

export const metadata = {
  title: "Elite Content Generator",
  description: "Generate researched, SEO-ready articles in seconds"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
