"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon, UserIcon, FolderIcon, BookOpenIcon,
  EnvelopeIcon, CommandLineIcon, Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolid, UserIcon as UserSolid, FolderIcon as FolderSolid,
  BookOpenIcon as BookSolid, EnvelopeIcon as EnvelopeSolid,
  CommandLineIcon as CommandSolid,
} from "@heroicons/react/24/solid";

const navItems = [
  { href: "/",         label: "Home",     icon: HomeIcon,     solid: HomeSolid },
  { href: "/about",    label: "About",    icon: UserIcon,     solid: UserSolid },
  { href: "/projects", label: "Projects", icon: FolderIcon,   solid: FolderSolid },
  { href: "/blogs",    label: "Blogs",    icon: BookOpenIcon, solid: BookSolid },
  { href: "/skills",   label: "Skills",   icon: CommandLineIcon, solid: CommandSolid },
  { href: "/contact",  label: "Contact",  icon: EnvelopeIcon, solid: EnvelopeSolid },
];

export default function ActivityBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="vsc-activity-bar">
      <div className="flex flex-col flex-1 gap-1">
        {navItems.map(({ href, label, icon: Icon, solid: Solid }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <div
              key={href}
              className={`vsc-activity-icon ${isActive ? "active" : ""}`}
              onClick={() => router.push(href)}
              title={label}
            >
              {isActive
                ? <Solid className="w-6 h-6" />
                : <Icon className="w-6 h-6" />
              }
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-1 mt-auto">
        <div
          className="vsc-activity-icon"
          onClick={() => router.push("/dashboard")}
          title="Dashboard"
        >
          <Cog6ToothIcon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
