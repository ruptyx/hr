"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreHorizontal, PlusCircle, Trash2, Edit, CheckCircle, XCircle } from "lucide-react";

// UI Components
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// Actions, schema, and types
import { addPayrollSet, updatePayrollSet, deletePayrollSet } from "../actions";
import { payrollSetSchema, type PayrollSetInput } from "../schemas";
import type { PayrollSet, OrganizationOption } from "../data";

type PayrollSetsClientPageProps = {
  payrollSets: PayrollSet[];
  organizations: OrganizationOption[];
};

// The main client component for the Payroll Sets UI.
export function PayrollSetsClientPage({
  payrollSets: initialPayrollSets,
  organizations,
}: PayrollSetsClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPayrollSet, setCurrentPayrollSet] = useState<PayrollSet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // react-hook-form setup with Zod for validation
  const form = useForm<PayrollSetInput>({
    resolver: zodResolver(payrollSetSchema),
    defaultValues: {
      name: "",
      description: null,
      company_party_id: undefined,
      is_active: true,
    },
  });

  // Handles both adding and updating payroll sets
  const handleFormSubmit = async (values: PayrollSetInput) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("company_party_id", String(values.company_party_id));
      
      if (values.description) {
        formData.append("description", values.description);
      }
      
      // The checkbox value needs to be 'on' for FormData to pick it up correctly in the action
      if (values.is_active) {
        formData.append("is_active", "on");
      }

      // Determine whether to call the 'add' or 'update' action
      const result = currentPayrollSet
        ? await updatePayrollSet(currentPayrollSet.payroll_set_id, formData)
        : await addPayrollSet(formData);

      if (result.error) {
        // In a real app, show a toast notification
        alert("Error: " + result.error);
        console.error(result.error);
      } else {
        // Close modal and reset form on success
        // The page will automatically refresh thanks to revalidatePath in the action
        setIsModalOpen(false);
        setCurrentPayrollSet(null);
        form.reset({
          name: "",
          description: null,
          company_party_id: undefined,
          is_active: true,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepares and opens the modal for adding a new item
  const openAddModal = () => {
    setCurrentPayrollSet(null);
    form.reset({
      name: "",
      description: null,
      company_party_id: undefined,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  // Prepares and opens the modal for editing an existing item
  const openEditModal = (ps: PayrollSet) => {
    setCurrentPayrollSet(ps);
    form.reset({
      name: ps.name,
      description: ps.description,
      company_party_id: ps.company_party_id ?? undefined,
      is_active: ps.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  // Handles the delete action with a confirmation dialog
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this payroll set?")) {
      const result = await deletePayrollSet(id);
      if (result.error) {
        alert("Error: " + result.error);
        console.error(result.error);
      }
      // Success message will be handled by revalidation showing updated data
    }
  };

  // Close modal handler
  const handleModalClose = (open: boolean) => {
    if (!open) {
      setCurrentPayrollSet(null);
      form.reset();
    }
    setIsModalOpen(open);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Payroll Sets</h1>
          <p className="text-neutral-500">
            Group employees for payroll processing.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Payroll Set
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentPayrollSet ? "Edit" : "Add"} Payroll Set
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              {/* Name Field */}
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  {...form.register("name")} 
                  maxLength={100}
                  placeholder="Enter payroll set name"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Company Selection */}
              <div>
                <Label htmlFor="company_party_id">Company *</Label>
                <Select
                  onValueChange={(value) => {
                    const numValue = Number(value);
                    form.setValue('company_party_id', numValue, { shouldValidate: true });
                  }}
                  value={form.watch("company_party_id")?.toString() || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.party_id} value={String(org.party_id)}>
                        {org.name || `Organization ${org.party_id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.company_party_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.company_party_id.message}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  {...form.register("description")} 
                  placeholder="Optional description"
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={form.watch("is_active")}
                  onCheckedChange={(checked) => form.setValue("is_active", !!checked)}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting 
                  ? "Saving..." 
                  : (currentPayrollSet ? "Save Changes" : "Create Payroll Set")
                }
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPayrollSets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                  No payroll sets found. Create your first one to get started.
                </TableCell>
              </TableRow>
            ) : (
              initialPayrollSets.map((ps) => (
                <TableRow key={ps.payroll_set_id}>
                  <TableCell className="font-medium">{ps.name}</TableCell>
                  <TableCell>
                    {ps.company_name || "No company assigned"}
                  </TableCell>
                  <TableCell className="max-w-sm">
                    <div className="truncate" title={ps.description || ""}>
                      {ps.description || "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {ps.is_active ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-neutral-400" />
                    )}
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
                        <DropdownMenuItem onClick={() => openEditModal(ps)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(ps.payroll_set_id)}
                          className="text-red-600 focus:text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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