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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addLeaveType, updateLeaveType, deleteLeaveType } from "../actions";
import { leaveTypeSchema } from "../schemas";
import type { LeaveType } from "../data";

type PolicyType = "accrued" | "granted";

// Helper to convert hours from DB to days for UI, assuming 8-hour workday
const toDays = (hours: number | null | undefined) => (hours ? hours / 8 : "");

type LeaveTypesClientPageProps = {
  leaveTypes: LeaveType[];
};

export function LeaveTypesClientPage({
  leaveTypes: initialLeaveTypes,
}: LeaveTypesClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLeaveType, setCurrentLeaveType] = useState<LeaveType | null>(
    null
  );

  const form = useForm<z.infer<typeof leaveTypeSchema>>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      name: "",
      policy_type: "accrued",
      description: "",
      is_paid: true,
      accrual_rate: undefined,
      max_accrual_hours: undefined,
      carryover_allowed: false,
      max_carryover_hours: undefined,
      min_employment_months: undefined,
      gender_restriction: "any",
      usage_period: undefined,
      max_times_usable: undefined,
      max_days_per_occurrence: undefined,
      requires_documentation: false,
    },
  });

  const policyType = form.watch("policy_type");

  const handleFormSubmit = async (values: z.infer<typeof leaveTypeSchema>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const action = currentLeaveType
      ? updateLeaveType.bind(null, currentLeaveType.leave_type_id)
      : addLeaveType;

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
    setCurrentLeaveType(null);
    form.reset();
    setIsModalOpen(true);
  };

  const openEditModal = (lt: LeaveType) => {
    setCurrentLeaveType(lt);
    form.reset({
      name: lt.name,
      policy_type: lt.accrual_rate !== null ? "accrued" : "granted",
      description: lt.description || "",
      is_paid: lt.is_paid ?? true,
      accrual_rate: toDays(lt.accrual_rate) as number | undefined,
      max_accrual_hours: toDays(lt.max_accrual_hours) as number | undefined,
      carryover_allowed: lt.carryover_allowed ?? false,
      max_carryover_hours: toDays(lt.max_carryover_hours) as number | undefined,
      min_employment_months: lt.min_employment_months || undefined,
      gender_restriction: lt.gender_restriction || "any",
      usage_period: lt.usage_period || undefined,
      max_times_usable: lt.max_times_usable || undefined,
      max_days_per_occurrence: lt.max_days_per_occurrence || undefined,
      requires_documentation: lt.requires_documentation ?? false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this leave type?")) {
      const result = await deleteLeaveType(id);
      if (result.error) {
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
            Define policies for employee time off.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Leave Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {currentLeaveType ? "Edit" : "Add"} Leave Type
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="name">Leave Name</Label>
                <Input {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Policy Type</Label>
                <RadioGroup
                  onValueChange={(value) =>
                    form.setValue("policy_type", value as PolicyType)
                  }
                  defaultValue={form.watch("policy_type")}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="accrued" id="r-accrued" />
                    <Label htmlFor="r-accrued">Accrued</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="granted" id="r-granted" />
                    <Label htmlFor="r-granted">Granted</Label>
                  </div>
                </RadioGroup>
              </div>

              {policyType === "accrued" && (
                <div className="p-4 border rounded-md space-y-4 bg-neutral-50">
                  <h3 className="font-semibold text-md">Accrual Rules</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accrual_rate">Accrual Rate (days)</Label>
                      <Input
                        {...form.register("accrual_rate")}
                        type="number"
                        step="0.0001"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_accrual_hours">
                        Max Accrual (days)
                      </Label>
                      <Input
                        {...form.register("max_accrual_hours")}
                        type="number"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 pt-4">
                      <Checkbox
                        {...form.register("carryover_allowed")}
                        id="carryover_allowed"
                      />
                      <Label htmlFor="carryover_allowed">Allow Carry-over</Label>
                    </div>
                    <div>
                      <Label htmlFor="max_carryover_hours">
                        Max Carry-over (days)
                      </Label>
                      <Input
                        {...form.register("max_carryover_hours")}
                        type="number"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {policyType === "granted" && (
                <div className="p-4 border rounded-md space-y-4 bg-neutral-50">
                  <h3 className="font-semibold text-md">
                    Eligibility & Usage Rules
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min_employment_months">
                        Min. Employment (Months)
                      </Label>
                      <Input
                        {...form.register("min_employment_months")}
                        type="number"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender_restriction">
                        Gender Restriction
                      </Label>
                      <Select
                        {...form.register("gender_restriction")}
                        defaultValue={form.watch("gender_restriction")}
                      >
                        <SelectTrigger />
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="usage_period">Usage Period</Label>
                      <Select
                        {...form.register("usage_period")}
                        defaultValue={form.watch("usage_period")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="per_year">Per Year</SelectItem>
                          <SelectItem value="per_employment">
                            Per Employment
                          </SelectItem>
                          <SelectItem value="lifetime">Lifetime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="max_times_usable">Max Times Usable</Label>
                      <Input
                        {...form.register("max_times_usable")}
                        type="number"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="max_days_per_occurrence">
                      Max Days Per Occurrence
                    </Label>
                    <Input
                      {...form.register("max_days_per_occurrence")}
                      type="number"
                      min="0"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox {...form.register("is_paid")} id="is_paid" />
                  <Label htmlFor="is_paid">This is a paid leave</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    {...form.register("requires_documentation")}
                    id="requires_documentation"
                  />
                  <Label htmlFor="requires_documentation">
                    Requires Documentation
                  </Label>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    {...form.register("description")}
                    placeholder="Describe when this leave should be used..."
                  />
                </div>
              </div>

              <Button type="submit" className="w-full !mt-8">
                {currentLeaveType ? "Save Changes" : "Create Leave Type"}
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
              <TableHead>Policy Type</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Accrual Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialLeaveTypes.map((lt) => (
              <TableRow key={lt.leave_type_id}>
                <TableCell className="font-medium">{lt.name}</TableCell>
                <TableCell>
                  {lt.accrual_rate !== null ? "Accrued" : "Granted"}
                </TableCell>
                <TableCell>{lt.is_paid ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {lt.accrual_rate !== null
                    ? `${(lt.accrual_rate / 8).toFixed(4)} days`
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditModal(lt)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(lt.leave_type_id)}
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