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
import { MoreHorizontal, PlusCircle, Trash2, Edit, Calculator } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addPayrollSet, updatePayrollSet, deletePayrollSet } from "../actions";
import { payrollSetSchema } from "../schemas";
import type { PayrollSet } from "../data";

type PayrollSetsClientPageProps = {
  payrollSets: PayrollSet[];
};

const calculationMethodLabels = {
  fixed_days: "Fixed Days",
  calendar_days: "Calendar Days", 
  daily_wages: "Daily Wages"
};

export function PayrollSetsClientPage({
  payrollSets: initialPayrollSets,
}: PayrollSetsClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPayrollSet, setCurrentPayrollSet] = useState<PayrollSet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof payrollSetSchema>>({
    resolver: zodResolver(payrollSetSchema),
    defaultValues: {
      set_name: "",
      set_name_arabic: "",
      calculation_method: "fixed_days",
      cut_off_day: 25,
      working_hours_per_day: 8,
      working_days_per_period: 26,
      max_salary_deduction_percentage: undefined,
      is_active: true,
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof payrollSetSchema>) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("set_name", values.set_name);
    formData.append("set_name_arabic", values.set_name_arabic || "");
    formData.append("calculation_method", values.calculation_method);
    formData.append("cut_off_day", values.cut_off_day.toString());
    formData.append("working_hours_per_day", values.working_hours_per_day.toString());
    formData.append("working_days_per_period", values.working_days_per_period.toString());
    if (values.max_salary_deduction_percentage) {
      formData.append("max_salary_deduction_percentage", values.max_salary_deduction_percentage.toString());
    }
    formData.append("is_active", values.is_active.toString());

    const action = currentPayrollSet
      ? updatePayrollSet.bind(null, currentPayrollSet.id)
      : addPayrollSet;

    const result = await action(formData);

    if (result && 'error' in result && result.error) {
      console.error(result.error);
      alert(typeof result.error === 'string' ? result.error : 'An error occurred');
    } else {
      setIsModalOpen(false);
      form.reset();
      setCurrentPayrollSet(null);
    }
    
    setIsSubmitting(false);
  };

  const openAddModal = () => {
    setCurrentPayrollSet(null);
    form.reset({
      set_name: "",
      set_name_arabic: "",
      calculation_method: "fixed_days",
      cut_off_day: 25,
      working_hours_per_day: 8,
      working_days_per_period: 26,
      max_salary_deduction_percentage: undefined,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (payrollSet: PayrollSet) => {
    setCurrentPayrollSet(payrollSet);
    form.reset({
      set_name: payrollSet.set_name,
      set_name_arabic: payrollSet.set_name_arabic || "",
      calculation_method: payrollSet.calculation_method as "fixed_days" | "calendar_days" | "daily_wages",
      cut_off_day: payrollSet.cut_off_day,
      working_hours_per_day: payrollSet.working_hours_per_day,
      working_days_per_period: payrollSet.working_days_per_period,
      max_salary_deduction_percentage: payrollSet.max_salary_deduction_percentage || undefined,
      is_active: payrollSet.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this payroll set? This action cannot be undone.")) {
      const result = await deletePayrollSet(id);
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
            Manage Payroll Sets
          </h1>
          <p className="text-neutral-500">
            Create and configure payroll calculation rules for different employee groups.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Payroll Set
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {currentPayrollSet ? "Edit" : "Add"} Payroll Set
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="set_name">Set Name *</Label>
                  <Input 
                    {...form.register("set_name")} 
                    placeholder="e.g., Full Time Employees"
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.set_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.set_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="set_name_arabic">Set Name (Arabic)</Label>
                  <Input 
                    {...form.register("set_name_arabic")} 
                    placeholder="الاسم بالعربية"
                    disabled={isSubmitting}
                  />
                </div>
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
                        <SelectValue placeholder="Select calculation method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed_days">Fixed Days</SelectItem>
                        <SelectItem value="calendar_days">Calendar Days</SelectItem>
                        <SelectItem value="daily_wages">Daily Wages</SelectItem>
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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cut_off_day">Cut-off Day *</Label>
                  <Input 
                    type="number"
                    min="1"
                    max="31"
                    {...form.register("cut_off_day", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.cut_off_day && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.cut_off_day.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="working_hours_per_day">Hours/Day *</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="24"
                    {...form.register("working_hours_per_day", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.working_hours_per_day && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.working_hours_per_day.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="working_days_per_period">Days/Period *</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="31"
                    {...form.register("working_days_per_period", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.working_days_per_period && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.working_days_per_period.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="max_salary_deduction_percentage">Max Deduction % (Optional)</Label>
                <Input 
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g., 25 for 25%"
                  {...form.register("max_salary_deduction_percentage", { valueAsNumber: true })}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Maximum percentage of salary that can be deducted (for compliance with labor laws)
                </p>
                {form.formState.errors.max_salary_deduction_percentage && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.max_salary_deduction_percentage.message}
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
                  : currentPayrollSet 
                    ? "Save Changes" 
                    : "Create Payroll Set"
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
              <TableHead>Set Name</TableHead>
              <TableHead>Calculation Method</TableHead>
              <TableHead>Cut-off Day</TableHead>
              <TableHead>Hours/Days</TableHead>
              <TableHead>Max Deduction %</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPayrollSets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                  <Calculator className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  No payroll sets found. Create your first payroll set to get started.
                </TableCell>
              </TableRow>
            ) : (
              initialPayrollSets.map((payrollSet) => (
                <TableRow key={payrollSet.id}>
                  <TableCell>
                    <div className="font-medium">{payrollSet.set_name}</div>
                    {payrollSet.set_name_arabic && (
                      <div className="text-sm text-neutral-500">{payrollSet.set_name_arabic}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {calculationMethodLabels[payrollSet.calculation_method as keyof typeof calculationMethodLabels]}
                  </TableCell>
                  <TableCell>{payrollSet.cut_off_day}</TableCell>
                  <TableCell>
                    {payrollSet.working_hours_per_day}h / {payrollSet.working_days_per_period}d
                  </TableCell>
                  <TableCell>
                    {payrollSet.max_salary_deduction_percentage 
                      ? `${payrollSet.max_salary_deduction_percentage}%` 
                      : "—"
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={payrollSet.is_active ? "default" : "secondary"}>
                      {payrollSet.is_active ? "Active" : "Inactive"}
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
                        <DropdownMenuItem onClick={() => openEditModal(payrollSet)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(payrollSet.id)}
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