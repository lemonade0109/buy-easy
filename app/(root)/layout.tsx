import Footer from "@/components/footer/footer";
import Header from "@/components/shared/header/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />

      <main className="flex-1 wrapper p-4">{children}</main>

      <Footer />
    </div>
  );
}
