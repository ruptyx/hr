'use client'

import { useState } from 'react'
import { LeaveRequest } from '../data'
import { LEAVE_TYPES } from '../constants'
import { updateLeaveRequest, deleteLeaveRequest, approveLeaveRequest, rejectLeaveRequest } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MoreHorizontal, Edit, Trash2, Check, X, Eye } from 'lucide-react'

interface LeaveRequestActionsProps {
  leaveRequest: LeaveRequest
}

export function LeaveRequestActions({ leaveRequest }: LeaveRequestActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0]
  }

  const canEdit = leaveRequest.status === 'Pending'
  const canApprove = leaveRequest.status === 'Pending'

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          
          {canApprove && (
            <>
              <DropdownMenuSeparator />
              <form action={approveLeaveRequest} className="contents">
                <input type="hidden" name="request_id" value={leaveRequest.request_id} />
                <input type="hidden" name="company_id" value={leaveRequest.company_id} />
                <DropdownMenuItem asChild>
                  <button type="submit" className="w-full flex items-center text-green-600">
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </button>
                </DropdownMenuItem>
              </form>
              <form action={rejectLeaveRequest} className="contents">
                <input type="hidden" name="request_id" value={leaveRequest.request_id} />
                <input type="hidden" name="company_id" value={leaveRequest.company_id} />
                <DropdownMenuItem asChild>
                  <button type="submit" className="w-full flex items-center text-red-600">
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </button>
                </DropdownMenuItem>
              </form>
            </>
          )}

          {canEdit && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Employee ID</Label>
                <p className="text-sm text-gray-900 mt-1">#{leaveRequest.employee_id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Leave Type</Label>
                <p className="text-sm text-gray-900 mt-1">{leaveRequest.leave_type}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(leaveRequest.start_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">End Date</Label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(leaveRequest.end_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Status</Label>
                <p className="text-sm text-gray-900 mt-1">{leaveRequest.status}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Submitted On</Label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(leaveRequest.created_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {leaveRequest.remarks && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Remarks</Label>
                <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                  {leaveRequest.remarks}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={() => setIsViewOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Leave Request</DialogTitle>
          </DialogHeader>
          <form action={updateLeaveRequest} className="space-y-4">
            <input type="hidden" name="request_id" value={leaveRequest.request_id} />
            <input type="hidden" name="company_id" value={leaveRequest.company_id} />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID
                </Label>
                <Input
                  id="employee_id"
                  name="employee_id"
                  type="number"
                  defaultValue={leaveRequest.employee_id}
                  required
                />
              </div>

              <div>
                <Label htmlFor="leave_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type
                </Label>
                <Select name="leave_type" defaultValue={leaveRequest.leave_type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAVE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  defaultValue={formatDateForInput(leaveRequest.start_date)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  defaultValue={formatDateForInput(leaveRequest.end_date)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </Label>
              <Textarea
                id="remarks"
                name="remarks"
                defaultValue={leaveRequest.remarks || ''}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsEditOpen(false)}
              >
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Leave Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this leave request for Employee #{leaveRequest.employee_id}? 
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </Button>
              <form action={deleteLeaveRequest} className="inline">
                <input type="hidden" name="request_id" value={leaveRequest.request_id} />
                <input type="hidden" name="company_id" value={leaveRequest.company_id} />
                <Button 
                  type="submit"
                  variant="destructive"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Delete
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}