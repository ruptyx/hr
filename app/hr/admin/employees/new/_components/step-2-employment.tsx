// /app/hr/admin/employees/new/_components/step-2-employment.tsx

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { FormData } from "./add-employee-form";
import { useMemo } from "react";

type Department = { department_id: number; department_name: string };
type Position = { position_id: number; title: string; department_id: number };

type StepProps = {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  departments: Department[];
  positions: Position[];
};

export function Step2Employment({ formData, updateFormData, departments, positions }: StepProps) {
  const filteredPositions = useMemo(() => {
    if (!formData.departmentId) return [];
    return positions.filter(p => p.department_id === parseInt(formData.departmentId));
  }, [formData.departmentId, positions]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Employment Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Department</Label>
          <Select value={formData.departmentId} onValueChange={(value) => updateFormData({ departmentId: value, positionId: "" })}>
            <SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger>
            <SelectContent>
              {departments.map(dep => <SelectItem key={dep.department_id} value={dep.department_id.toString()}>{dep.department_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Position / Title</Label>
          <Select value={formData.positionId} onValueChange={(value) => updateFormData({ positionId: value })} disabled={!formData.departmentId}>
            <SelectTrigger><SelectValue placeholder="Select a position" /></SelectTrigger>
            <SelectContent>
              {filteredPositions.map(pos => <SelectItem key={pos.position_id} value={pos.position_id.toString()}>{pos.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
         <div className="space-y-2">
          {/* Label updated for clarity */}
          <Label htmlFor="startDate">Company Join Date</Label>
           <Popover>
              <PopoverTrigger asChild>
                <Button id="startDate" variant={"outline"} className="w-full justify-start text-left font-normal border-neutral-300">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={formData.startDate} onSelect={(date) => updateFormData({ startDate: date })} initialFocus />
              </PopoverContent>
            </Popover>
        </div>
        <div className="space-y-2">
          <Label>Employment Type</Label>
          <Select value={formData.employmentType} onValueChange={(value) => updateFormData({ employmentType: value as 'Salaried' | 'Hourly', salaryFlag: value === 'Salaried' })}>
            <SelectTrigger><SelectValue placeholder="Select employment type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Salaried">Salaried</SelectItem>
              <SelectItem value="Hourly">Hourly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}