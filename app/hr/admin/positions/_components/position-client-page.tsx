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
import { MoreHorizontal, PlusCircle, Trash2, Edit, Briefcase } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDesignation, updateDesignation, deleteDesignation } from "../actions";
import { designationSchema } from "../schemas";
import type { Designation } from "../data";

type DesignationsClientPageProps = {
  designations: Designation[];
};

export function DesignationsClientPage({
  designations: initialDesignations,
}: DesignationsClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDesignation, setCurrentDesignation] = useState<Designation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof designationSchema>>({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof designationSchema>) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("name", values.name);

    const action = currentDesignation
      ? updateDesignation.bind(null, currentDesignation.id)
      : addDesignation;

    const result = await action(formData);

    if (result && 'error' in result && result.error) {
      console.error(result.error);
      alert(typeof result.error === 'string' ? result.error : 'An error occurred');
    } else {
      setIsModalOpen(false);
      form.reset();
      setCurrentDesignation(null);
    }
    
    setIsSubmitting(false);
  };

  const openAddModal = () => {
    setCurrentDesignation(null);
    form.reset({ name: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (designation: Designation) => {
    setCurrentDesignation(designation);
    form.reset({
      name: designation.name,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this designation? This action cannot be undone.")) {
      const result = await deleteDesignation(id);
      if (result && 'error' in result && result.error) {
        alert(result.error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Designations
          </h1>
          <p className="text-neutral-500">
            Create and manage job titles and position designations for your organization.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Designation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentDesignation ? "Edit" : "Add"} Designation
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name">Designation Name *</Label>
                <Input 
                  {...form.register("name")} 
                  placeholder="Enter designation name (e.g., Software Engineer, Manager)"
                  disabled={isSubmitting}
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting 
                  ? "Saving..." 
                  : currentDesignation 
                    ? "Save Changes" 
                    : "Create Designation"
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
              <TableHead>Designation Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialDesignations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8 text-neutral-500">
                  <Briefcase className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  No designations found. Create your first designation to get started.
                </TableCell>
              </TableRow>
            ) : (
              initialDesignations.map((designation) => (
                <TableRow key={designation.id}>
                  <TableCell className="font-medium">
                    {designation.name}
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
                        <DropdownMenuItem onClick={() => openEditModal(designation)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(designation.id)}
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