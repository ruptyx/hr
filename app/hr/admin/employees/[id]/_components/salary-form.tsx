// /app/hr/admin/employees/[id]/_components/salary-form.tsx
"use client";

import { useState, useEffect } from 'react';
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
import { Trash2, PlusCircle } from "lucide-react";
import { saveCompensation } from '../actions';
import { SalaryComponentType } from '../../data';

type SalaryFormProps = {
  employeeId: number;
  salaryComponentTypes: SalaryComponentType[];
  initialCompensation: Compensation | null;
};

type ComponentRow = {
  id: number; // For React key
  component_type_id: number | null;
  amount: number;
};

export function SalaryForm({ employeeId, salaryComponentTypes, initialCompensation }: SalaryFormProps) {
  const [components, setComponents] = useState<ComponentRow[]>([]);
  const [totalSalary, setTotalSalary] = useState(0);
  const [fromDate, setFromDate] = useState('');

  useEffect(() => {
    if (initialCompensation) {
      const initialRows = initialCompensation.compensation_component.map((c, index) => ({
        id: index,
        component_type_id: c.component_type_id,
        amount: c.amount,
      }));
      setComponents(initialRows);
      setFromDate(initialCompensation.from_date.split('T')[0]);
    } else {
      // Start with one empty row if no compensation exists
      setComponents([{ id: Date.now(), component_type_id: null, amount: 0 }]);
    }
  }, [initialCompensation]);

  useEffect(() => {
    // Recalculate total salary whenever components change
    const total = components.reduce((sum, comp) => sum + Number(comp.amount || 0), 0);
    setTotalSalary(total);
  }, [components]);


  const handleComponentChange = (index: number, field: 'component_type_id' | 'amount', value: any) => {
    const newComponents = [...components];
    const parsedValue = field === 'component_type_id' ? Number(value) : value;
    (newComponents[index] as any)[field] = parsedValue;
    setComponents(newComponents);
  };

  const addComponent = () => {
    setComponents([...components, { id: Date.now(), component_type_id: null, amount: 0 }]);
  };

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!fromDate) {
        alert("Please select a 'From Date' for the compensation.");
        return;
    }

    const compensationData = {
        total_amount: totalSalary,
        from_date: fromDate,
        components: components.map(({ component_type_id, amount }) => ({
            component_type_id,
            amount: Number(amount),
        })).filter(c => c.component_type_id !== null && c.amount > 0) // Filter out invalid rows
    };

    const result = await saveCompensation(employeeId, compensationData);
    if (result.error) {
        alert(result.error);
    } else {
        alert(result.success);
    }
  };

  return (
    <div className="p-6 border rounded-lg mt-8">
      <h3 className="text-lg font-semibold mb-4">Salary & Compensation</h3>
      <div className="space-y-4">
        {components.map((component, index) => (
          <div key={component.id} className="flex items-end gap-4">
            <div className="flex-1">
              <Label>Component</Label>
              <Select
                value={String(component.component_type_id ?? '')}
                onValueChange={(value) => handleComponentChange(index, 'component_type_id', value)}
              >
                <SelectTrigger><SelectValue placeholder="Select component" /></SelectTrigger>
                <SelectContent>
                  {salaryComponentTypes.map(type => (
                    <SelectItem key={type.component_type_id} value={String(type.component_type_id)}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Label>Amount</Label>
              <Input
                type="number"
                value={component.amount}
                onChange={(e) => handleComponentChange(index, 'amount', e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => removeComponent(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addComponent}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Component
        </Button>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-2 gap-6 items-end">
            <div>
                <Label htmlFor="from_date">From Date</Label>
                <Input id="from_date" name="from_date" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </div>
            <div className="text-right">
                <p className="text-sm text-neutral-500">Total Salary</p>
                <p className="text-2xl font-bold">
                    {totalSalary.toLocaleString('en-US', { style: 'currency', currency: 'KWD' })}
                </p>
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 mt-6 border-t">
        <Button onClick={handleSave}>Save Compensation</Button>
      </div>
    </div>
  );
}
