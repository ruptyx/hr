// /app/hr/admin/leave-types/_components/LeaveTypeForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createLeaveType, updateLeaveType } from "../actions";
import type { LeaveType, SalaryComponent } from "../types";

interface LeaveTypeFormProps {
  leaveType?: LeaveType;
  salaryComponents: SalaryComponent[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function LeaveTypeForm({ leaveType, salaryComponents, onSuccess, onCancel }: LeaveTypeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      name_arabic: formData.get("name_arabic") as string || undefined,
      behavior_type: formData.get("behavior_type") as string,
      eligibility_after_days: formData.get("eligibility_after_days") ? Number(formData.get("eligibility_after_days")) : undefined,
      total_days_allowed_per_year: formData.get("total_days_allowed_per_year") ? Number(formData.get("total_days_allowed_per_year")) : undefined,
      attachment_is_mandatory: formData.get("attachment_is_mandatory") === "on",
      leave_payment_component_id: formData.get("leave_payment_component_id") === "none" ? undefined : formData.get("leave_payment_component_id") as string,
      encashment_payment_component_id: formData.get("encashment_payment_component_id") === "none" ? undefined : formData.get("encashment_payment_component_id") as string,
      expense_account_code: formData.get("expense_account_code") as string || undefined,
      provision_account_code: formData.get("provision_account_code") as string || undefined,
      is_active: formData.get("is_active") === "on",
    };

    const result = leaveType 
      ? await updateLeaveType(leaveType.id, data)
      : await createLeaveType(data);

    if (result.error) {
      setError(typeof result.error === 'string' ? result.error : 'Validation errors occurred');
    } else {
      onSuccess();
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="code">Code *</Label>
          <Input
            id="code"
            name="code"
            defaultValue={leaveType?.code}
            required
            className="uppercase"
            placeholder="ANNUAL"
          />
        </div>
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={leaveType?.name}
            required
            placeholder="Annual Leave"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="name_arabic">Arabic Name</Label>
        <Input
          id="name_arabic"
          name="name_arabic"
          defaultValue={leaveType?.name_arabic}
          placeholder="الاسم بالعربية"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="behavior_type">Behavior Type *</Label>
          <Select name="behavior_type" defaultValue={leaveType?.behavior_type || "paid"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="half_paid">Half Paid</SelectItem>
              <SelectItem value="carry_forward">Carry Forward</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="eligibility_after_days">Eligibility After (Days)</Label>
          <Input
            id="eligibility_after_days"
            name="eligibility_after_days"
            type="number"
            min="0"
            defaultValue={leaveType?.eligibility_after_days}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="total_days_allowed_per_year">Total Days Per Year</Label>
        <Input
          id="total_days_allowed_per_year"
          name="total_days_allowed_per_year"
          type="number"
          min="0"
          max="365"
          step="0.5"
          defaultValue={leaveType?.total_days_allowed_per_year}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="leave_payment_component_id">Leave Payment Component</Label>
          <Select name="leave_payment_component_id" defaultValue={leaveType?.leave_payment_component_id || "none"}>
            <SelectTrigger>
              <SelectValue placeholder="Select component" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {salaryComponents.map((component) => (
                <SelectItem key={component.id} value={component.id}>
                  {component.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="encashment_payment_component_id">Encashment Component</Label>
          <Select name="encashment_payment_component_id" defaultValue={leaveType?.encashment_payment_component_id || "none"}>
            <SelectTrigger>
              <SelectValue placeholder="Select component" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {salaryComponents.map((component) => (
                <SelectItem key={component.id} value={component.id}>
                  {component.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expense_account_code">Expense Account Code</Label>
          <Input
            id="expense_account_code"
            name="expense_account_code"
            defaultValue={leaveType?.expense_account_code}
            placeholder="5201001"
          />
        </div>
        <div>
          <Label htmlFor="provision_account_code">Provision Account Code</Label>
          <Input
            id="provision_account_code"
            name="provision_account_code"
            defaultValue={leaveType?.provision_account_code}
            placeholder="2301001"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="attachment_is_mandatory"
            name="attachment_is_mandatory"
            defaultChecked={leaveType?.attachment_is_mandatory}
          />
          <Label htmlFor="attachment_is_mandatory">Attachment Required</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            name="is_active"
            defaultChecked={leaveType?.is_active ?? true}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : leaveType ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}