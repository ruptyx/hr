"use client";

import { useState, useEffect } from "react";
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
import { MoreHorizontal, PlusCircle, Trash2, Edit, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDepartment, updateDepartment, deleteDepartment } from "../actions";
import { departmentSchema } from "../schemas";
import { getDepartmentsForSelect } from "../data";
import type { Department } from "../data";

type DepartmentsClientPageProps = {
  departments: Department[];
};

export function DepartmentsClientPage({
  departments: initialDepartments,
}: DepartmentsClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [parentDepartments, setParentDepartments] = useState<{ id: string; name: string; parent_name?: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      parent_department_id: "none",
    },
  });

  // Load parent departments for select dropdown
  useEffect(() => {
    const loadParentDepartments = async () => {
      const departments = await getDepartmentsForSelect();
      setParentDepartments(departments);
    };
    
    if (isModalOpen) {
      loadParentDepartments();
    }
  }, [isModalOpen]);

  const handleFormSubmit = async (values: z.infer<typeof departmentSchema>) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("name", values.name);
    
    // Handle empty string for parent_department_id
    if (values.parent_department_id && values.parent_department_id !== "" && values.parent_department_id !== "none") {
      formData.append("parent_department_id", values.parent_department_id);
    }

    const action = currentDepartment
      ? updateDepartment.bind(null, currentDepartment.id)
      : addDepartment;

    const result = await action(formData);

    if (result && 'error' in result && result.error) {
      console.error(result.error);
      alert(typeof result.error === 'string' ? result.error : 'An error occurred');
    } else {
      setIsModalOpen(false);
      form.reset();
      setCurrentDepartment(null);
    }
    
    setIsSubmitting(false);
  };

  const openAddModal = () => {
    setCurrentDepartment(null);
    form.reset({ 
      name: "", 
      parent_department_id: "none" 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (department: Department) => {
    setCurrentDepartment(department);
    form.reset({
      name: department.name,
      parent_department_id: department.parent_department_id || "none",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this department? This action cannot be undone.")) {
      const result = await deleteDepartment(id);
      if (result && 'error' in result && result.error) {
        alert(result.error);
      }
    }
  };

  // Helper function to get department hierarchy display
  const getDepartmentHierarchy = (dept: Department) => {
    const indent = "  ".repeat(dept.level || 0);
    return `${indent}${dept.name}`;
  };

  // Filter out current department from parent options when editing
  const getAvailableParentDepartments = () => {
    if (!currentDepartment) return parentDepartments;
    return parentDepartments.filter(dept => dept.id !== currentDepartment.id);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Departments
          </h1>
          <p className="text-neutral-500">
            View, add, edit, or remove organizational departments and their hierarchy.
          </p>
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
              <DialogTitle>
                {currentDepartment ? "Edit" : "Add"} Department
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name">Department Name *</Label>
                <Input 
                  {...form.register("name")} 
                  placeholder="Enter department name"
                  disabled={isSubmitting}
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="parent_department_id">Parent Department (Optional)</Label>
                <Controller
                  name="parent_department_id"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value || "none"}
                      onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent department (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Parent (Top Level)</SelectItem>
                        {getAvailableParentDepartments().map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.parent_name ? `${dept.parent_name} > ${dept.name}` : dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.parent_department_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.parent_department_id.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting 
                  ? "Saving..." 
                  : currentDepartment 
                    ? "Save Changes" 
                    : "Create Department"
                }
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
              <TableHead>Sub-departments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialDepartments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-neutral-500">
                  <Building2 className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  No departments found. Create your first department to get started.
                </TableCell>
              </TableRow>
            ) : (
              initialDepartments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">
                    {getDepartmentHierarchy(dept)}
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {dept.parent_name || "—"}
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {dept.children_count ? `${dept.children_count} sub-dept${dept.children_count > 1 ? 's' : ''}` : "—"}
                  </TableCell>
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
                        <DropdownMenuItem
                          onClick={() => handleDelete(dept.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}