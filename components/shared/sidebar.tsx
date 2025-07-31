
"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Package2 } from "lucide-react"

import { Button } from "@/components/ui/button"

const links = [
  { href: "/hr/admin", label: "Dashboard" },
  { href: "/hr/admin/employees", label: "Employees" },
  { href: "/hr/admin/departments", label: "Departments" },
  { href: "/hr/admin/positions", label: "Positions" },
  { href: "/hr/admin/leave-types", label: "Leave Types" },
  { href: "/hr/admin/leaves", label: "Leaves" },
  { href: "/hr/admin/salary-components", label: "Salary Components" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">HR Admin</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname === link.href ? "bg-muted text-primary" : ""
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
