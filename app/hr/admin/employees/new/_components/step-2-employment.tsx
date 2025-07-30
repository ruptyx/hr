// /app/hr/admin/employees/new/_components/step-2-employment.tsx
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import type { FormData } from "./add-employee-form";
import type { Department, PositionTypeForForm, Manager } from '../data';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type StepProps = {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  departments: Department[];
  positionTypes: PositionTypeForForm[];
  managers: Manager[];
  errors?: any;
};

export function Step2Employment({ formData, updateFormData, departments, positionTypes, managers, errors }: StepProps) {
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [positionTypeOpen, setPositionTypeOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Employment Details</h2>
      
      <div className="space-y-2">
        <Label>Department <span className="text-red-500">*</span></Label>
        <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={departmentOpen} className="w-full justify-between font-normal">
              {formData.departmentId ? departments.find((d) => d.department_id.toString() === formData.departmentId)?.department_name : "Select department..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Search department..." />
              <CommandEmpty>No department found.</CommandEmpty>
              <CommandGroup>
                {departments.map((dep) => (
                  <CommandItem key={dep.department_id} value={dep.department_name} onSelect={() => { updateFormData({ departmentId: dep.department_id.toString() }); setDepartmentOpen(false); }}>
                    <Check className={`mr-2 h-4 w-4 ${formData.departmentId === dep.department_id.toString() ? "opacity-100" : "opacity-0"}`} />
                    {dep.department_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {errors?.departmentId && <p className="text-xs text-red-500">{errors.departmentId[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label>Position Type <span className="text-red-500">*</span></Label>
        <Popover open={positionTypeOpen} onOpenChange={setPositionTypeOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={positionTypeOpen} className="w-full justify-between font-normal">
              {formData.positionTypeId ? positionTypes.find((pt) => pt.position_type_id.toString() === formData.positionTypeId)?.title : "Select position type..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Search position type..." />
              <CommandEmpty>No position type found.</CommandEmpty>
              <CommandGroup>
                {positionTypes.map((pt) => (
                  <CommandItem key={pt.position_type_id} value={pt.title} onSelect={() => { updateFormData({ positionTypeId: pt.position_type_id.toString() }); setPositionTypeOpen(false); }}>
                    <Check className={`mr-2 h-4 w-4 ${formData.positionTypeId === pt.position_type_id.toString() ? "opacity-100" : "opacity-0"}`} />
                    {pt.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {errors?.positionTypeId && <p className="text-xs text-red-500">{errors.positionTypeId[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label>Reports To (Optional)</Label>
        <Popover open={managerOpen} onOpenChange={setManagerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={managerOpen} className="w-full justify-between font-normal">
              {formData.managerId ? managers.find((m) => m.party_id.toString() === formData.managerId)?.name_english : "Select a manager..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Search manager..." />
              <CommandEmpty>No manager found.</CommandEmpty>
              <CommandGroup>
                {managers.map((m) => (
                  <CommandItem key={m.party_id} value={m.name_english} onSelect={() => { updateFormData({ managerId: m.party_id.toString() }); setManagerOpen(false); }}>
                    <Check className={`mr-2 h-4 w-4 ${formData.managerId === m.party_id.toString() ? "opacity-100" : "opacity-0"}`} />
                    {m.name_english}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <hr className="my-6 border-neutral-200" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">Company Join Date <span className="text-red-500">*</span></Label>
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
          {errors?.joinDate && <p className="text-xs text-red-500">{errors.joinDate[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label>Employment Type</Label>
           <RadioGroup name="employmentType" value={formData.employmentType} onValueChange={(value) => updateFormData({ employmentType: value as 'Salaried' | 'Hourly', salaryFlag: value === 'Salaried' })} className="flex gap-4 pt-2">
              <div className="flex items-center space-x-2"><RadioGroupItem value="Salaried" id="r-salaried" /><Label htmlFor="r-salaried">Salaried</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="Hourly" id="r-hourly" /><Label htmlFor="r-hourly">Hourly</Label></div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
