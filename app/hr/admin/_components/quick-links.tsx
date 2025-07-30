// /hr/admin/_components/quick-links.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Users,
  Briefcase,
  FileText,
  CalendarDays, // New icon
  ChevronLeft,  // New icon
  ChevronRight, // New icon
} from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/hr/admin/employees/new", label: "Add New Employee", icon: PlusCircle },
  { href: "/hr/admin/employees", label: "Manage Employees", icon: Users },
  { href: "/hr/admin/positions", label: "Manage Positions", icon: Briefcase },
  { href: "/hr/admin/leaves", label: "Manage Leaves", icon: CalendarDays },
  { href: "/hr/admin/reports", label: "Generate Reports", icon: FileText },
];

const LINKS_PER_PAGE = 4;

export function QuickLinks() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(links.length / LINKS_PER_PAGE);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const startIndex = currentPage * LINKS_PER_PAGE;
  const currentLinks = links.slice(startIndex, startIndex + LINKS_PER_PAGE);

  return (
    <Card className="bg-neutral-50 border-neutral-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-black">Quick Actions</CardTitle>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrev}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous links</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next links</span>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentLinks.map((link) => (
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
