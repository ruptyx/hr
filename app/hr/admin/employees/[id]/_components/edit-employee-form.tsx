"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateEmployee } from "../actions"; // Fixed import name
import { SalaryForm } from "./salary-form";
import {
  EmployeeDetail,
  PotentialManager,
  SalaryComponentType,
  Compensation,
} from "../../data";
import { useFormState } from "react-dom";
import { format } from "date-fns";

type EditEmployeeFormProps = {
  employee: EmployeeDetail;
  managers: PotentialManager[];
  salaryComponentTypes: SalaryComponentType[];
  compensation: Compensation | null;
};

export function EditEmployeeForm({
  employee,
  managers,
  salaryComponentTypes,
  compensation,
}: EditEmployeeFormProps) {
  const initialState = { message: "", errors: {} };
  const updateEmployeeWithId = updateEmployee.bind(null, employee.party_id); // Fixed function name
  const [state, dispatch] = useFormState(updateEmployeeWithId, initialState);

  return (
    <>
      <form action={dispatch} className="space-y-8 mt-8">
        {/* Personal Information Section */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name_english">Full Name (English)</Label>
              <Input
                id="name_english"
                name="name_english"
                defaultValue={employee.name_english}
                required
              />
            </div>
            <div>
              <Label htmlFor="name_arabic">Full Name (Arabic)</Label>
              <Input
                id="name_arabic"
                name="name_arabic"
                defaultValue={employee.name_arabic || ""}
                dir="rtl"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={employee.email || ""}
              />
            </div>
            <div>
              <Label htmlFor="mobile_number">Mobile Number</Label>
              <Input
                id="mobile_number"
                name="mobile_number"
                defaultValue={employee.mobile_number}
                required
              />
            </div>
            <div>
              <Label htmlFor="birth_date">Birth Date</Label>
              <Input
                id="birth_date"
                name="birth_date"
                type="date"
                defaultValue={
                  employee.birth_date
                    ? format(new Date(employee.birth_date), "yyyy-MM-dd")
                    : ""
                }
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" defaultValue={employee.gender || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="marital_status">Marital Status</Label>
              <Select
                name="marital_status"
                defaultValue={employee.marital_status || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                name="nationality"
                defaultValue={employee.nationality || ""}
              />
            </div>
          </div>
        </div>

        {/* Employment Information Section */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Employment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="manager_party_id">Manager</Label>
              <Select
                name="manager_party_id"
                defaultValue={String(employee.manager_party_id ?? "null")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">No Manager</SelectItem>
                  {managers.map((manager) => (
                    <SelectItem
                      key={manager.party_id}
                      value={String(manager.party_id)}
                    >
                      {manager.name_english}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Other Information Section */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Other Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="emergency_contact_number">Emergency Contact</Label>
              <Input
                id="emergency_contact_number"
                name="emergency_contact_number"
                defaultValue={employee.emergency_contact_number || ""}
              />
            </div>
            <div>
              <Label htmlFor="religion">Religion</Label>
              <Input
                id="religion"
                name="religion"
                defaultValue={employee.religion || ""}
              />
            </div>
            <div>
              <Label htmlFor="blood_group">Blood Group</Label>
              <Input
                id="blood_group"
                name="blood_group"
                defaultValue={employee.blood_group || ""}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">Save Employee Details</Button>
        </div>
      </form>

      {/* Salary Form Section */}
      <SalaryForm
        employeeId={employee.party_id}
        salaryComponentTypes={salaryComponentTypes}
        initialCompensation={compensation}
      />
    </>
  );
}