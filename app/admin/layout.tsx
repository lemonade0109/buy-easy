import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import MenuBar from "@/components/shared/header/menu";
import MainNav from "./main-nav";
import AdminSearch from "@/components/admin/admin-search";
import MobileSearchWrapper from "@/components/shared/header/mobile-search-wrapper";
import ModeToggler from "@/components/shared/header/mode-toggler";
import MobileNavMenu from "@/components/admin/mobile-nav-menu";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col ">
        <div className="border-b container mx-auto">
          <div className="flex items-center h-16 px-4">
            <Link href="/" className="w-22">
              <Image src="/logo.svg" alt={APP_NAME} width={48} height={48} />
            </Link>

            {/* MainNav for md+ screens, SortSelect for mobile */}
            <div className="hidden md:block">
              <MainNav className="mx-6" />
            </div>
            <div className="block md:hidden ">
              <MobileNavMenu />
            </div>

            <div className="ml-auto flex items-center space-x-4 ">
              <div className="hidden md:block">
                <AdminSearch />
              </div>

              <div className="flex items-center gap-2">
                <div className="md:hidden">
                  <ModeToggler />
                </div>
                <MobileSearchWrapper />
                <MenuBar />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
          {children}
        </div>
      </div>
    </>
  );
}
