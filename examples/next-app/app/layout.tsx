export const metadata = { title: 'Liquid Glass · Next.js', icons: { icon: 'data:,' } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, height: "100vh", backgroundColor: "#0b0b14" }}>{children}</body>
    </html>
  );
}
