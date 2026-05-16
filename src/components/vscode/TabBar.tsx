"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FileIcon } from "./Icons";
import { XMarkIcon } from "@heroicons/react/24/outline";

const pathLabels: Record<string, string[]> = {
  "/":         ["portfolio", "home.jsx"],
  "/about":    ["portfolio", "about.html"],
  "/projects": ["portfolio", "projects.tsx"],
  "/blogs":    ["portfolio", "blogs.md"],
  "/skills":   ["portfolio", "skills.json"],
  "/contact":  ["portfolio", "contact.css"],
};

export default function TabBar() {
  const pathname = usePathname();

  return (
    <div className="vsc-tabs">
      {Object.entries(pathLabels).map(([href, [, file]]) => {
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div className={`vsc-tab ${isActive ? "active" : ""}`}>
              <FileIcon filename={file} />
              <span>{file}</span>
              {isActive && (
                <XMarkIcon className="w-3 h-3 ml-2 opacity-60 hover:opacity-100" />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
