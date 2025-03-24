"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  CircleDollarSign,
  FileText,
  Menu,
  NotebookPen,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HamburgerMenu() {
  const pathName = usePathname();
  const user = useQuery(api.user.getUser);

  return (
    <Sheet>
      <SheetTrigger className="flex items-center justify-center">
        <Menu className="w-5 h-5 cursor-pointer" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Access the features</SheetDescription>
        </SheetHeader>
        <SheetContent>
          <ul className="space-y-6 mt-12">
            <li>
              <Link
                className={`font-light flex gap-2 items-center text-xl hover:text-cyan-300 ${pathName.endsWith("/search") && "text-cyan-400"}`}
                href={"/dashboard/search"}
              >
                <Search />
                Search
              </Link>
            </li>
            <li>
              <Link
                className={`font-light flex gap-2 items-center text-xl hover:text-cyan-300 ${pathName.endsWith("/documents") && "text-cyan-400"}`}
                href={"/dashboard/documents"}
              >
                <FileText />
                Documents
              </Link>
            </li>
            <li>
              <Link
                className={`font-light flex gap-2 items-center text-xl hover:text-cyan-300 ${pathName.endsWith("/notes") && "text-cyan-400"}`}
                href={"/dashboard/notes"}
              >
                <NotebookPen />
                Notes
              </Link>
            </li>
            {user?.isPremium === false && (
              <li>
                <Link
                  className={`font-light flex gap-2 items-center text-xl hover:text-cyan-300 ${pathName.endsWith("/pricing") && "text-cyan-400"}`}
                  href={"/pricing"}
                >
                  <CircleDollarSign />
                  Pricing
                </Link>
              </li>
            )}
          </ul>
        </SheetContent>
      </SheetContent>
    </Sheet>
  );
}
