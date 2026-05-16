"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { FileIcon } from "./Icons";

const fileTree = [
  {
    folder: "portfolio",
    files: [
      { name: "home.jsx",     href: "/" },
      { name: "about.html",    href: "/about" },
      { name: "projects.tsx", href: "/projects" },
      { name: "blogs.md",    href: "/blogs" },
      { name: "skills.json",   href: "/skills" },
      { name: "contact.css",  href: "/contact" },
    ],
  },
];

export default function Sidebar({ onSelect }: { onSelect?: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <div className="vsc-sidebar">
      <div className="vsc-sidebar-header">Explorer</div>
      <div className="vsc-sidebar-content">
        {fileTree.map(({ folder, files }) => (
          <div key={folder}>
            <div className="vsc-file-tree-folder" onClick={() => setOpen(!open)}>
              {open
                ? <ChevronDownIcon className="w-3 h-3" />
                : <ChevronRightIcon className="w-3 h-3" />
              }
              <span>📁 {folder}</span>
            </div>
            {open && files.map(({ name, href }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link key={name} href={href} prefetch={true} style={{ textDecoration: "none" }} onClick={onSelect}>
                  <div
                    className={`vsc-file-tree-item ${isActive ? "active" : ""}`}
                    style={{ paddingLeft: 28 }}
                  >
                    <FileIcon filename={name} />
                    <span style={{ fontSize: 13, marginLeft: 6 }}>{name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
        {/* ... */}
      </div>
    </div>
  );
}
