"use client";
// Suggested path: /app/payroll/run/_components/payroll-client-page.tsx

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Loader2, FileDown, Banknote } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Actions, schemas, and types
import { calculatePayroll, generatePayslips, exportBankFile } from "../actions";
import { EmployeePayrollData } from "@/app/hr/admin/payroll/schemas";

// Fix 1: Define the correct payroll selection schema with proper types
const payrollSelectionSchema = z.object({
  period: z.string().regex(/^\d{4}-\d{2}$/, "Period must be in YYYY-MM format."),
  payroll_set_id: z.number().min(1, "You must select a payroll set."), // Changed from z.coerce.number()
});

// Fix 2: Create proper type definitions
type PayrollSelectionFormData = z.infer<typeof payrollSelectionSchema>;

// Fix 3: Define the expected PayrollSet type to match your data structure
type PayrollSet = {
  payroll_set_id: number;
  name: string | null;
};

type PayrollClientPageProps = {
  payrollSets: PayrollSet[];
};

export function PayrollClientPage({ payrollSets = [] }: PayrollClientPageProps) {
  const [payrollData, setPayrollData] = useState<EmployeePayrollData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fix 4: Properly type the useForm hook with correct generic parameters
  const form = useForm<PayrollSelectionFormData>({
    resolver: zodResolver(payrollSelectionSchema),
    defaultValues: {
      period: new Date().toISOString().slice(0, 7), // Default to current month YYYY-MM
      payroll_set_id: 0, // Use 0 as default instead of undefined
    },
  });

  // Fix 5: Properly type the submit handler
  const handleCalculate: SubmitHandler<PayrollSelectionFormData> = async (values) => {
    setIsLoading(true);
    setError(null);
    setPayrollData([]);

    const result = await calculatePayroll(values.period, values.payroll_set_id);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setPayrollData(result.data);
    }
    setIsLoading(false);
  };
  
  // Summary Dashboard Calculations
  const summary = payrollData.reduce(
    (acc, emp) => {
      acc.totalGross += emp.gross_pay;
      acc.totalDeductions += emp.total_deductions;
      acc.totalNet += emp.net_pay;
      return acc;
    },
    { totalGross: 0, totalDeductions: 0, totalNet: 0 }
  );

  return (
    <div className="space-y-8">
      {/* 1. Payroll Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle>1. Select Payroll Period</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleCalculate)} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="period">Month/Year</Label>
              <Input type="month" id="period" {...form.register("period")} />
              {form.formState.errors.period && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.period.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="payroll_set_id">Payroll Set</Label>
              <Select
                onValueChange={(value) => {
                  // Fix 6: Ensure the value is properly converted to number and validated
                  const numValue = parseInt(value, 10);
                  if (!isNaN(numValue)) {
                    form.setValue('payroll_set_id', numValue, { shouldValidate: true });
                  }
                }}
                value={form.watch("payroll_set_id") > 0 ? String(form.watch("payroll_set_id")) : ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a payroll set" />
                </SelectTrigger>
                <SelectContent>
                  {/* Fix 7: Add defensive checks and proper handling */}
                  {Array.isArray(payrollSets) && payrollSets.length > 0 ? (
                    payrollSets.map((ps) => (
                      <SelectItem key={ps.payroll_set_id} value={String(ps.payroll_set_id)}>
                        {ps.name || `Payroll Set ${ps.payroll_set_id}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-sets" disabled>
                      No payroll sets available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {form.formState.errors.payroll_set_id && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.payroll_set_id.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CalendarIcon className="mr-2 h-4 w-4" />
                )}
                Load & Calculate Payroll
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* 2. Employee List & Payroll Data */}
      {payrollData.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>2. Payroll Details</CardTitle>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => generatePayslips(payrollData)}>
                <FileDown className="mr-2 h-4 w-4" /> Generate Payslips
              </Button>
              <Button variant="outline" onClick={() => exportBankFile(payrollData, 1)}>
                <Banknote className="mr-2 h-4 w-4" /> Export Bank File
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead className="text-right">Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((emp) => (
                    <TableRow key={emp.employee_party_id}>
                      <TableCell className="font-medium">{emp.employee_name}</TableCell>
                      <TableCell>{emp.basic_salary.toFixed(2)}</TableCell>
                      <TableCell>{emp.gross_pay.toFixed(2)}</TableCell>
                      <TableCell className="text-red-500">{emp.total_deductions.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold">{emp.net_pay.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={emp.status === 'Calculated' ? 'default' : 'destructive'}>
                          {emp.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold">Totals</TableCell>
                    <TableCell className="font-bold">{summary.totalGross.toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-red-500">{summary.totalDeductions.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-extrabold text-lg">{summary.totalNet.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
            <div className="flex justify-end mt-4">
              <Button size="lg">Finalize Payroll</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}