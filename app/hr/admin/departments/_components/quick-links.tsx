// /hr/admin/_components/quick-links.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, Briefcase, FileText, Building2 } from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/hr/admin/employees/new", label: "Add New Employee", icon: PlusCircle },
  { href: "/hr/admin/employees", label: "Manage Employees", icon: Users },
  { href: "/hr/admin/positions", label: "Manage Positions", icon: Briefcase },
  // NEW: Link to manage departments
  { href: "/hr/admin/departments", label: "Manage Departments", icon: Building2 },
];

export function QuickLinks() {
  return (
    <Card className="bg-neutral-50 border-neutral-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {links.map((link) => (
          <Button
            key={link.label}
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2 border-neutral-300 hover:bg-neutral-100"
            asChild
          >
            <Link href={link.href}>
              <link.icon className="h-6 w-6 text-neutral-700" />
              <span className="text-center text-xs text-neutral-800">{link.label}</span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
