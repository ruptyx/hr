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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreHorizontal,
  PlusCircle,
  Trash2,
  Edit,
  BadgeCheck,
  BadgeX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  addSalaryComponentType,
  updateSalaryComponentType,
  deleteSalaryComponentType,
} from "../actions";
import { salaryComponentSchema } from "../schemas";
import type { SalaryComponentType } from "../data";

type SalaryComponentsClientPageProps = {
  salaryComponents: SalaryComponentType[];
};

export function SalaryComponentsClientPage({
  salaryComponents: initialComponents,
}: SalaryComponentsClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComponent, setCurrentComponent] =
    useState<SalaryComponentType | null>(null);

  const form = useForm<z.infer<typeof salaryComponentSchema>>({
    resolver: zodResolver(salaryComponentSchema),
    defaultValues: {
      name: "",
      description: "",
      is_taxable: true,
      is_basic_salary: false,
      display_order: 0,
      main_account_code: "",
      dimension_1: "",
      dimension_2: "",
      dimension_3: "",
      dimension_4: "",
      dimension_5: "",
    },
  });

  const handleFormSubmit = async (
    values: z.infer<typeof salaryComponentSchema>
  ) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const action = currentComponent
      ? updateSalaryComponentType.bind(null, currentComponent.component_type_id)
      : addSalaryComponentType;

    const result = await action(formData);

    if (result.error) {
      // Handle error (e.g., show toast notification)
      console.error(result.error);
    } else {
      setIsModalOpen(false);
      form.reset();
      // In a real app, you'd likely refetch the data here.
    }
  };

  const openAddModal = () => {
    setCurrentComponent(null);
    form.reset();
    setIsModalOpen(true);
  };

  const openEditModal = (sc: SalaryComponentType) => {
    setCurrentComponent(sc);
    form.reset({
      name: sc.name,
      description: sc.description || "",
      is_taxable: sc.is_taxable ?? true,
      is_basic_salary: sc.is_basic_salary ?? false,
      display_order: sc.display_order,
      main_account_code: sc.main_account_code || "",
      dimension_1: sc.dimension_1 || "",
      dimension_2: sc.dimension_2 || "",
      dimension_3: sc.dimension_3 || "",
      dimension_4: sc.dimension_4 || "",
      dimension_5: sc.dimension_5 || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this salary component?")) {
      const result = await deleteSalaryComponentType(id);
      if (result.error) {
        alert(result.error);
      }
    }
  };

  const sortedComponents = [...initialComponents].sort(
    (a, b) => a.display_order - b.display_order
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Salary Components
          </h1>
          <p className="text-neutral-500">
            Define earnings and deductions for payroll processing.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Component
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {currentComponent ? "Edit" : "Add"} Salary Component
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="name">Component Name</Label>
                <Input {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea {...form.register("description")} />
              </div>
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox {...form.register("is_basic_salary")} />
                  <Label htmlFor="is_basic_salary">Is Basic Salary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox {...form.register("is_taxable")} />
                  <Label htmlFor="is_taxable">Is Taxable</Label>
                </div>
              </div>

              <div className="p-4 border rounded-md space-y-4 bg-neutral-50">
                <h3 className="font-semibold text-md">
                  Financial Integration (Defaults)
                </h3>
                <div>
                  <Label htmlFor="main_account_code">Main Account Code</Label>
                  <Input {...form.register("main_account_code")} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dimension_1">Dimension 1</Label>
                    <Input {...form.register("dimension_1")} />
                  </div>
                  <div>
                    <Label htmlFor="dimension_2">Dimension 2</Label>
                    <Input {...form.register("dimension_2")} />
                  </div>
                  <div>
                    <Label htmlFor="dimension_3">Dimension 3</Label>
                    <Input {...form.register("dimension_3")} />
                  </div>
                  <div>
                    <Label htmlFor="dimension_4">Dimension 4</Label>
                    <Input {...form.register("dimension_4")} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dimension_5">Dimension 5</Label>
                  <Input {...form.register("dimension_5")} />
                </div>
              </div>

              <Button type="submit" className="w-full !mt-8">
                {currentComponent ? "Save Changes" : "Create Component"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Is Basic</TableHead>
              <TableHead>Is Taxable</TableHead>
              <TableHead>Account Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedComponents.map((sc) => (
              <TableRow key={sc.component_type_id}>
                <TableCell className="font-medium">{sc.name}</TableCell>
                <TableCell>
                  {sc.is_basic_salary ? (
                    <BadgeCheck className="text-green-600" />
                  ) : (
                    <BadgeX className="text-neutral-400" />
                  )}
                </TableCell>
                <TableCell>
                  {sc.is_taxable ? (
                    <BadgeCheck className="text-green-600" />
                  ) : (
                    <BadgeX className="text-neutral-400" />
                  )}
                </TableCell>
                <TableCell>{sc.main_account_code || "—"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditModal(sc)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(sc.component_type_id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
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