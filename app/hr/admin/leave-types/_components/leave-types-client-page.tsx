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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Trash2, Edit, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addLeaveType, updateLeaveType, deleteLeaveType } from "../actions";
import { leaveTypeSchema } from "../schemas";
import { getSalaryComponentsForLeave } from "../data";
import type { LeaveType } from "../data";

type LeaveTypesClientPageProps = {
  leaveTypes: LeaveType[];
};

const behaviorTypeLabels = {
  paid: "Paid",
  unpaid: "Unpaid",
  half_paid: "Half Paid",
  carry_forward: "Carry Forward"
};

const accrualTypeLabels = {
  accrued: "Accrued",
  granted: "Granted"
};

const getAccrualTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "accrued": return "default";
    case "granted": return "secondary";
    default: return "outline";
  }
};

const getBehaviorTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "paid": return "default";
    case "unpaid": return "destructive";
    case "half_paid": return "secondary";
    case "carry_forward": return "outline";
    default: return "outline";
  }
};

export function LeaveTypesClientPage({
  leaveTypes: initialLeaveTypes,
}: LeaveTypesClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLeaveType, setCurrentLeaveType] = useState<LeaveType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salaryComponents, setSalaryComponents] = useState<{ id: string; name: string }[]>([]);

  const form = useForm<z.infer<typeof leaveTypeSchema>>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      code: "",
      name: "",
      name_arabic: "",
      behavior_type: "paid",
      accrual_type: "accrued",
      eligibility_after_days: undefined,
      total_days_allowed_per_year: undefined,
      attachment_is_mandatory: false,
      leave_payment_component_id: "",
      encashment_payment_component_id: "",
      expense_account_code: "",
      provision_account_code: "",
      is_active: true,
    },
  });

  // Load salary components for dropdowns
  useEffect(() => {
    const loadSalaryComponents = async () => {
      const components = await getSalaryComponentsForLeave();
      setSalaryComponents(components);
    };
    
    if (isModalOpen) {
      loadSalaryComponents();
    }
  }, [isModalOpen]);

  const handleFormSubmit = async (values: z.infer<typeof leaveTypeSchema>) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("code", values.code);
    formData.append("name", values.name);
    formData.append("name_arabic", values.name_arabic || "");
    formData.append("behavior_type", values.behavior_type);
    formData.append("accrual_type", values.accrual_type);
    if (values.eligibility_after_days !== undefined) {
      formData.append("eligibility_after_days", values.eligibility_after_days.toString());
    }
    if (values.total_days_allowed_per_year !== undefined) {
      formData.append("total_days_allowed_per_year", values.total_days_allowed_per_year.toString());
    }
    formData.append("attachment_is_mandatory", (values.attachment_is_mandatory || false).toString());
    if (values.leave_payment_component_id && values.leave_payment_component_id !== "none") {
      formData.append("leave_payment_component_id", values.leave_payment_component_id);
    }
    if (values.encashment_payment_component_id && values.encashment_payment_component_id !== "none") {
      formData.append("encashment_payment_component_id", values.encashment_payment_component_id);
    }
    if (values.expense_account_code) {
      formData.append("expense_account_code", values.expense_account_code);
    }
    if (values.provision_account_code) {
      formData.append("provision_account_code", values.provision_account_code);
    }
    formData.append("is_active", values.is_active.toString());

    const action = currentLeaveType
      ? updateLeaveType.bind(null, currentLeaveType.id)
      : addLeaveType;

    const result = await action(formData);

    if (result && 'error' in result && result.error) {
      console.error(result.error);
      alert(typeof result.error === 'string' ? result.error : 'An error occurred');
    } else {
      setIsModalOpen(false);
      form.reset();
      setCurrentLeaveType(null);
    }
    
    setIsSubmitting(false);
  };

  const openAddModal = () => {
    setCurrentLeaveType(null);
    form.reset({
      code: "",
      name: "",
      name_arabic: "",
      behavior_type: "paid",
      accrual_type: "accrued",
      eligibility_after_days: undefined,
      total_days_allowed_per_year: undefined,
      attachment_is_mandatory: false,
      leave_payment_component_id: "none",
      encashment_payment_component_id: "none",
      expense_account_code: "",
      provision_account_code: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (leaveType: LeaveType) => {
    setCurrentLeaveType(leaveType);
    form.reset({
      code: leaveType.code,
      name: leaveType.name,
      name_arabic: leaveType.name_arabic || "",
      behavior_type: leaveType.behavior_type as "paid" | "unpaid" | "half_paid" | "carry_forward",
      accrual_type: leaveType.accrual_type as "accrued" | "granted",
      eligibility_after_days: leaveType.eligibility_after_days || undefined,
      total_days_allowed_per_year: leaveType.total_days_allowed_per_year || undefined,
      attachment_is_mandatory: leaveType.attachment_is_mandatory || false,
      leave_payment_component_id: leaveType.leave_payment_component_id || "none",
      encashment_payment_component_id: leaveType.encashment_payment_component_id || "none",
      expense_account_code: leaveType.expense_account_code || "",
      provision_account_code: leaveType.provision_account_code || "",
      is_active: leaveType.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this leave type? This action cannot be undone.")) {
      const result = await deleteLeaveType(id);
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
            Manage Leave Types
          </h1>
          <p className="text-neutral-500">
            Create and configure different types of employee leave with payment rules and eligibility criteria.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Leave Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {currentLeaveType ? "Edit" : "Add"} Leave Type
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Basic Information */}
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Leave Code *</Label>
                  <Input 
                    {...form.register("code")} 
                    placeholder="e.g., ANNUAL, SICK, MATERNITY"
                    style={{ textTransform: 'uppercase' }}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Uppercase letters, numbers, and underscores only
                  </p>
                  {form.formState.errors.code && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.code.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="name">Leave Name *</Label>
                  <Input 
                    {...form.register("name")} 
                    placeholder="e.g., Annual Leave, Sick Leave"
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="name_arabic">Leave Name (Arabic)</Label>
                <Input 
                  {...form.register("name_arabic")} 
                  placeholder="الاسم بالعربية"
                  disabled={isSubmitting}
                />
              </div>

              {/* Type Settings */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="behavior_type">Behavior Type *</Label>
                  <Controller
                    name="behavior_type"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select behavior type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="half_paid">Half Paid</SelectItem>
                          <SelectItem value="carry_forward">Carry Forward</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.behavior_type && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.behavior_type.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="accrual_type">Accrual Type *</Label>
                  <Controller
                    name="accrual_type"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select accrual type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accrued">Accrued (Earned over time)</SelectItem>
                          <SelectItem value="granted">Granted (Given as lump sum)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Accrued: earned gradually; Granted: given all at once
                  </p>
                  {form.formState.errors.accrual_type && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.accrual_type.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Controller
                    name="attachment_is_mandatory"
                    control={form.control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                  <Label htmlFor="attachment_is_mandatory">Attachment Required</Label>
                </div>
              </div>rigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="half_paid">Half Paid</SelectItem>
                          <SelectItem value="carry_forward">Carry Forward</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.behavior_type && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.behavior_type.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Leave Name *</Label>
                  <Input 
                    {...form.register("name")} 
                    placeholder="e.g., Annual Leave, Sick Leave"
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="name_arabic">Leave Name (Arabic)</Label>
                  <Input 
                    {...form.register("name_arabic")} 
                    placeholder="الاسم بالعربية"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Eligibility and Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eligibility_after_days">Eligibility After (Days)</Label>
                  <Input 
                    type="number"
                    min="0"
                    {...form.register("eligibility_after_days", { valueAsNumber: true })}
                    placeholder="e.g., 90"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Days employee must work before eligible for this leave
                  </p>
                  {form.formState.errors.eligibility_after_days && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.eligibility_after_days.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="total_days_allowed_per_year">Total Days Per Year</Label>
                  <Input 
                    type="number"
                    step="0.5"
                    min="0"
                    max="365"
                    {...form.register("total_days_allowed_per_year", { valueAsNumber: true })}
                    placeholder="e.g., 30"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Maximum days allowed per year for this leave type
                  </p>
                  {form.formState.errors.total_days_allowed_per_year && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.total_days_allowed_per_year.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Components */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leave_payment_component_id">Leave Payment Component</Label>
                  <Controller
                    name="leave_payment_component_id"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value || "none"}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment component" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Payment Component</SelectItem>
                          {salaryComponents.map((component) => (
                            <SelectItem key={component.id} value={component.id}>
                              {component.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Salary component used for leave payment calculation
                  </p>
                </div>

                <div>
                  <Label htmlFor="encashment_payment_component_id">Encashment Payment Component</Label>
                  <Controller
                    name="encashment_payment_component_id"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value || "none"}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select encashment component" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Encashment Component</SelectItem>
                          {salaryComponents.map((component) => (
                            <SelectItem key={component.id} value={component.id}>
                              {component.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Salary component used for leave encashment calculation
                  </p>
                </div>
              </div>

              {/* Account Codes */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expense_account_code">Expense Account Code</Label>
                  <Input 
                    {...form.register("expense_account_code")} 
                    placeholder="e.g., 5201001"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Chart of accounts code for leave expense
                  </p>
                </div>

                <div>
                  <Label htmlFor="provision_account_code">Provision Account Code</Label>
                  <Input 
                    {...form.register("provision_account_code")} 
                    placeholder="e.g., 2301001"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Chart of accounts code for leave provision
                  </p>
                </div>
              </div>

              {/* Switches */}
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
                  : currentLeaveType 
                    ? "Save Changes" 
                    : "Create Leave Type"
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
              <TableHead>Code</TableHead>
              <TableHead>Leave Name</TableHead>
              <TableHead>Behavior</TableHead>
              <TableHead>Accrual</TableHead>
              <TableHead>Eligibility</TableHead>
              <TableHead>Days/Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialLeaveTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-neutral-500">
                  <Calendar className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  No leave types found. Create your first leave type to get started.
                </TableCell>
              </TableRow>
            ) : (
              initialLeaveTypes.map((leaveType) => (
                <TableRow key={leaveType.id}>
                  <TableCell className="font-mono font-medium">
                    {leaveType.code}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{leaveType.name}</div>
                    {leaveType.name_arabic && (
                      <div className="text-sm text-neutral-500">{leaveType.name_arabic}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBehaviorTypeBadgeVariant(leaveType.behavior_type)}>
                      {behaviorTypeLabels[leaveType.behavior_type as keyof typeof behaviorTypeLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getAccrualTypeBadgeVariant(leaveType.accrual_type)}>
                      {accrualTypeLabels[leaveType.accrual_type as keyof typeof accrualTypeLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {leaveType.eligibility_after_days ? `${leaveType.eligibility_after_days} days` : "—"}
                  </TableCell>
                  <TableCell>
                    {leaveType.total_days_allowed_per_year ? `${leaveType.total_days_allowed_per_year} days` : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={leaveType.is_active ? "default" : "secondary"}>
                        {leaveType.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {leaveType.attachment_is_mandatory && (
                        <Badge variant="outline" className="text-xs">
                          Attachment Required
                        </Badge>
                      )}
                    </div>
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
                        <DropdownMenuItem onClick={() => openEditModal(leaveType)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(leaveType.id)}
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