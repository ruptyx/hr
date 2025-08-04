// /app/hr/admin/leave-types/_components/leave-types-client-page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Calendar } from "lucide-react";
import { deleteLeaveType } from "../actions";
import type { LeaveType, SalaryComponent } from "../types";
import { LeaveTypeForm } from "@/app/hr/admin/leave-types/_components/leave-type-form";

interface LeaveTypesClientPageProps {
  leaveTypes: LeaveType[];
  salaryComponents: SalaryComponent[];
}

const BEHAVIOR_TYPE_LABELS = {
  paid: "Paid",
  unpaid: "Unpaid", 
  half_paid: "Half Paid",
  carry_forward: "Carry Forward"
} as const;

const BEHAVIOR_TYPE_VARIANTS = {
  paid: "default",
  unpaid: "destructive",
  half_paid: "secondary", 
  carry_forward: "outline"
} as const;

export function LeaveTypesClientPage({ leaveTypes, salaryComponents }: LeaveTypesClientPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | undefined>();

  const handleAdd = () => {
    setEditingLeaveType(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (leaveType: LeaveType) => {
    setEditingLeaveType(leaveType);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this leave type?")) return;
    
    const result = await deleteLeaveType(id);
    if (result.error) {
      alert(result.error);
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setEditingLeaveType(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Types</h1>
          <p className="text-muted-foreground">
            Manage different types of employee leave with payment rules and eligibility criteria.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Leave Type
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Behavior</TableHead>
              <TableHead>Eligibility</TableHead>
              <TableHead>Days/Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  <Calendar className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  No leave types found. Create your first leave type to get started.
                </TableCell>
              </TableRow>
            ) : (
              leaveTypes.map((leaveType) => (
                <TableRow key={leaveType.id}>
                  <TableCell className="font-mono font-medium">
                    {leaveType.code}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{leaveType.name}</div>
                    {leaveType.name_arabic && (
                      <div className="text-sm text-muted-foreground">
                        {leaveType.name_arabic}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={BEHAVIOR_TYPE_VARIANTS[leaveType.behavior_type]}>
                      {BEHAVIOR_TYPE_LABELS[leaveType.behavior_type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {leaveType.eligibility_after_days ? `${leaveType.eligibility_after_days} days` : "—"}
                  </TableCell>
                  <TableCell>
                    {leaveType.total_days_allowed_per_year ? `${leaveType.total_days_allowed_per_year}` : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={leaveType.is_active ? "default" : "secondary"}>
                        {leaveType.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {leaveType.attachment_is_mandatory && (
                        <Badge variant="outline" className="text-xs">
                          Attachment
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(leaveType)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(leaveType.id)}
                          className="text-destructive"
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLeaveType ? "Edit Leave Type" : "Add Leave Type"}
            </DialogTitle>
          </DialogHeader>
          <LeaveTypeForm
          
            leaveType={editingLeaveType}
            salaryComponents={salaryComponents}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}