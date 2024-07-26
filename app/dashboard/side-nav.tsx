"use client";

import { FileText, NotebookPen, Search, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathName = usePathname();

  return (
    <nav>
      <ul className="space-y-6">
        <li>
          <Link
            className={`font-light flex gap-2 items-center text-xl hover:text-cyan-200 ${pathName.endsWith("/search") && "text-cyan-300"}`}
            href={"/dashboard/search"}
          >
            <Search />
            Search
          </Link>
        </li>
        <li>
          <Link
            className={`font-light flex gap-2 items-center text-xl hover:text-cyan-200 ${pathName.endsWith("/documents") && "text-cyan-300"}`}
            href={"/dashboard/documents"}
          >
            <FileText />
            Documents
          </Link>
        </li>
        <li>
          <Link
            className={`font-light flex gap-2 items-center text-xl hover:text-cyan-200 ${pathName.endsWith("/notes") && "text-cyan-300"}`}
            href={"/dashboard/notes"}
          >
            <NotebookPen />
            Notes
          </Link>
        </li>
        <li>
          <Link
            className={`font-light flex gap-2 items-center text-xl hover:text-cyan-200 ${pathName.endsWith("/settings") && "text-cyan-300"}`}
            href={"/dashboard/settings"}
          >
            <Settings />
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}
