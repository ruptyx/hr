// /app/hr/admin/leaves/_components/leaves-list.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LeaveRequest } from "../data";

type LeavesListProps = {
  leaveRequests: LeaveRequest[];
};

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'Pending': 'secondary',
    'Approved': 'default',
    'Rejected': 'destructive',
};


export function LeavesList({ leaveRequests }: LeavesListProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-center">Hours</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.length > 0 ? (
            leaveRequests.map((request) => (
              <TableRow key={request.leave_request_id}>
                <TableCell className="font-medium">{request.employee_name}</TableCell>
                <TableCell>{request.leave_type_name}</TableCell>
                import { format } from "date-fns";
// ... (imports)
                <TableCell>{format(new Date(request.start_date), "yyyy-MM-dd")}</TableCell>
                <TableCell>{format(new Date(request.end_date), "yyyy-MM-dd")}</TableCell>
// ... (rest of the file)
                <TableCell className="text-center">{request.hours_requested}</TableCell>
                <TableCell className="text-right">
                    <Badge variant={statusVariantMap[request.status] || 'outline'}>
                        {request.status}
                    </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No leave requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
