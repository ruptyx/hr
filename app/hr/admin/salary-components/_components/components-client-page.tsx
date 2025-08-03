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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Trash2, Edit, DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addSalaryComponent, updateSalaryComponent, deleteSalaryComponent } from "../actions";
import { salaryComponentSchema } from "../schemas";
import type { SalaryComponent } from "../data";

type SalaryComponentsClientPageProps = {
  salaryComponents: SalaryComponent[];
};

const typeLabels = {
  earning: "Earning",
  deduction: "Deduction",
  employer_contribution: "Employer Contribution"
};

const computationTypeLabels = {
  standard: "Standard",
  percentage: "Percentage",
  formula: "Formula Based",
  fixed: "Fixed Amount"
};

const calculationMethodLabels = {
  prorata: "Pro-rata",
  fixed_always: "Fixed Always",
  fixed_if_working: "Fixed if Working",
  fixed_if_paid_days: "Fixed if Paid Days"
};

const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "earning": return "default";
    case "deduction": return "destructive";
    case "employer_contribution": return "secondary";
    default: return "outline";
  }
};

export function SalaryComponentsClientPage({
  salaryComponents: initialSalaryComponents,
}: SalaryComponentsClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<SalaryComponent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof salaryComponentSchema>>({
    resolver: zodResolver(salaryComponentSchema),
    defaultValues: {
      name: "",
      name_arabic: "",
      type: "earning",
      computation_type: "standard",
      calculation_method: "prorata",
      main_account_code: "",
      is_active: true,
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof salaryComponentSchema>) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("name_arabic", values.name_arabic || "");
    formData.append("type", values.type);
    formData.append("computation_type", values.computation_type);
    formData.append("calculation_method", values.calculation_method);
    formData.append("main_account_code", values.main_account_code);
    formData.append("is_active", values.is_active.toString());

    const action = currentComponent
      ? updateSalaryComponent.bind(null, currentComponent.id)
      : addSalaryComponent;

    const result = await action(formData);

    if (result && 'error' in result && result.error) {
      console.error(result.error);
      alert(typeof result.error === 'string' ? result.error : 'An error occurred');
    } else {
      setIsModalOpen(false);
      form.reset();
      setCurrentComponent(null);
    }
    
    setIsSubmitting(false);
  };

  const openAddModal = () => {
    setCurrentComponent(null);
    form.reset({
      name: "",
      name_arabic: "",
      type: "earning",
      computation_type: "standard",
      calculation_method: "prorata",
      main_account_code: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (component: SalaryComponent) => {
    setCurrentComponent(component);
    form.reset({
      name: component.name,
      name_arabic: component.name_arabic || "",
      type: component.type as "earning" | "deduction" | "employer_contribution",
      computation_type: component.computation_type,
      calculation_method: component.calculation_method as "prorata" | "fixed_always" | "fixed_if_working" | "fixed_if_paid_days",
      main_account_code: component.main_account_code,
      is_active: component.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this salary component? This action cannot be undone.")) {
      const result = await deleteSalaryComponent(id);
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
            Manage Salary Components
          </h1>
          <p className="text-neutral-500">
            Create and configure earnings, deductions, and employer contributions for payroll calculations.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Component
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
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
                <Label htmlFor="type">Component Type *</Label>
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="earning">Earning</SelectItem>
                        <SelectItem value="deduction">Deduction</SelectItem>
                        <SelectItem value="employer_contribution">Employer Contribution</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.type && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Component Name *</Label>
                  <Input 
                    {...form.register("name")} 
                    placeholder="e.g., Basic Salary, Housing Allowance"
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="name_arabic">Component Name (Arabic)</Label>
                  <Input 
                    {...form.register("name_arabic")} 
                    placeholder="الاسم بالعربية"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="computation_type">Computation Type *</Label>
                  <Input 
                    {...form.register("computation_type")} 
                    placeholder="e.g., standard, percentage"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    How this component is computed (standard is default)
                  </p>
                  {form.formState.errors.computation_type && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.computation_type.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="calculation_method">Calculation Method *</Label>
                  <Controller
                    name="calculation_method"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prorata">Pro-rata</SelectItem>
                          <SelectItem value="fixed_always">Fixed Always</SelectItem>
                          <SelectItem value="fixed_if_working">Fixed if Working</SelectItem>
                          <SelectItem value="fixed_if_paid_days">Fixed if Paid Days</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.calculation_method && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.calculation_method.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="main_account_code">Main Account Code *</Label>
                <Input 
                  {...form.register("main_account_code")} 
                  placeholder="e.g., 5101001"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Chart of accounts code for this component
                </p>
                {form.formState.errors.main_account_code && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.main_account_code.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="is_active"
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  )}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting 
                  ? "Saving..." 
                  : currentComponent 
                    ? "Save Changes" 
                    : "Create Component"
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
              <TableHead>Component Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Computation</TableHead>
              <TableHead>Calculation</TableHead>
              <TableHead>Account Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialSalaryComponents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                  <DollarSign className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  No salary components found. Create your first component to get started.
                </TableCell>
              </TableRow>
            ) : (
              initialSalaryComponents.map((component) => (
                <TableRow key={component.id}>
                  <TableCell>
                    <div className="font-medium">{component.name}</div>
                    {component.name_arabic && (
                      <div className="text-sm text-neutral-500">{component.name_arabic}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(component.type)}>
                      {typeLabels[component.type as keyof typeof typeLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {component.computation_type}
                  </TableCell>
                  <TableCell>
                    {calculationMethodLabels[component.calculation_method as keyof typeof calculationMethodLabels]}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {component.main_account_code}
                  </TableCell>
                  <TableCell>
                    <Badge variant={component.is_active ? "default" : "secondary"}>
                      {component.is_active ? "Active" : "Inactive"}
                    </Badge>
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
                        <DropdownMenuItem onClick={() => openEditModal(component)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(component.id)}
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