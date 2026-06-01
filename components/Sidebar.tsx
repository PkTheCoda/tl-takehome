import Link from "next/link";
import { ReactNode } from "react";
import { FiHome, FiCheckSquare } from "react-icons/fi";
import { LuUsersRound } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbActivityHeartbeat } from "react-icons/tb";
import { CiUser } from "react-icons/ci";

const navItems: Array<{
  label: string;
  href: string;
  icon?: ReactNode;
}> = [
  { label: "Dashboard", href: "/", icon: <FiHome className="w-5 h-5" /> },
  { label: "Forms", href: "/forms", icon: <FiCheckSquare className="w-5 h-5" /> },
  { label: "Users", href: "/users", icon: <LuUsersRound className="w-5 h-5" /> },
  { label: "Manuscripts", href: "/manuscripts", icon: <IoDocumentTextOutline className="w-5 h-5" /> },
  { label: "Reports", href: "/reports", icon: <TbActivityHeartbeat className="w-5 h-5" /> },
  { label: "My profile", href: "/profile", icon: <CiUser className="w-5 h-5" /> },
];

export default function Sidebar() {
  return (
    <div className="col-span-1 bg-primary p-6 text-white h-full flex flex-col items-start gap-6">

      <div className="flex items-center gap-4 w-full mt-2">

        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="#E8E8E8" />
          <mask id="mask0_2845_181" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
            <circle cx="24" cy="24" r="24" fill="#E8E8E8" />
          </mask>
          <g mask="url(#mask0_2845_181)">
            <ellipse cx="23.5102" cy="13.7143" rx="7.83673" ry="7.83674" fill="white" />
            <rect x="11.7551" y="23.5102" width="23.5102" height="33.3061" rx="11.7551" fill="white" />
          </g>
        </svg>

        <div className="flex flex-col text-white">
          <div className="text-lg">Max Bacon</div>
          <div className="flex gap-x-2 items-center">
            <span className="size-3 rounded-full bg-red-600 border-2 border-white" />
            <span>Offline</span>
          </div>
        </div>

      </div>

      <nav className="flex flex-wrap justify-between lg:flex-col gap-2 w-full">
        {navItems.map((nav, idx) => (
          <Link
            key={nav.label + idx}
            href={nav.href}
            className="flex items-center gap-2 px-2 py-1 link"
          >
            {nav.icon}
            {nav.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
