import Footer from "@/components/footer/footer";
import Header from "@/components/shared/header/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 wrapper p-4 overflow-x-hidden">{children}</main>
        <Footer />
      </div>
    </>
  );
}
