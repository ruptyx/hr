// /app/hr/admin/departments/_components/departments-client-page.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { addDepartment, updateDepartment, deleteDepartment } from "../actions";
import type { Department } from "../data";

type DepartmentsClientPageProps = {
  departments: Department[];
};

export function DepartmentsClientPage({ departments: initialDepartments }: DepartmentsClientPageProps) {
  const [departments, setDepartments] = useState(initialDepartments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const action = currentDepartment ? updateDepartment.bind(null, currentDepartment.department_id) : addDepartment;
    
    const result = await action(formData);
    if (result.error) {
        alert(result.error); // Replace with a better notification system like a toast
    } else {
        setIsModalOpen(false);
        setCurrentDepartment(null);
    }
  };

  const openAddModal = () => {
    setCurrentDepartment(null);
    setIsModalOpen(true);
  };

  const openEditModal = (department: Department) => {
    setCurrentDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this department?")) {
        const result = await deleteDepartment(id);
        if (result.error) {
            alert(result.error);
        }
    }
  };
  
  const departmentNameMap = departments.reduce((acc, dept) => {
    acc[dept.department_id] = dept.department_name;
    return acc;
  }, {} as Record<number, string>);


  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Departments</h1>
          <p className="text-neutral-500">View, add, or remove organizational departments.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentDepartment ? "Edit" : "Add"} Department</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <Label htmlFor="department_name">Department Name</Label>
                <Input
                  id="department_name"
                  name="department_name"
                  defaultValue={currentDepartment?.department_name || ""}
                  required
                />
              </div>
              <div>
                <Label htmlFor="parent_department_id">Parent Department</Label>
                <Select name="parent_department_id" defaultValue={currentDepartment?.parent_department_id?.toString() || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent department (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* The <SelectItem value="">None</SelectItem> has been removed to fix the error */}
                    {departments
                      .filter(d => d.department_id !== currentDepartment?.department_id)
                      .map((dept) => (
                      <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                        {dept.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                {currentDepartment ? "Save Changes" : "Create Department"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department Name</TableHead>
              <TableHead>Parent Department</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.department_id}>
                <TableCell className="font-medium">{dept.department_name}</TableCell>
                <TableCell>{dept.parent_department_id ? departmentNameMap[dept.parent_department_id] : '—'}</TableCell>
                <TableCell>{new Date(dept.created_date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditModal(dept)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(dept.department_id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
