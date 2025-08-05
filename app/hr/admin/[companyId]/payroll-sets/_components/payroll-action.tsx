'use client'

import { useState } from 'react'
import { PayrollSet } from '../data'
import { PAY_FREQUENCIES } from '../constants'
import { updatePayrollSet, deletePayrollSet, updateLastRunDate } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { MoreHorizontal, Edit, Trash2, Play, Calendar } from 'lucide-react'

interface PayrollSetActionsProps {
  payrollSet: PayrollSet
}

export function PayrollSetActions({ payrollSet }: PayrollSetActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <form action={updateLastRunDate} className="contents">
                <input type="hidden" name="payroll_set_id" value={payrollSet.payroll_set_id} />
                <input type="hidden" name="company_id" value={payrollSet.company_id} />
                <DropdownMenuItem asChild>
                  <button type="submit" className="w-full flex items-center">
                    <Play className="mr-2 h-4 w-4" />
                    Mark as Run Today
                  </button>
                </DropdownMenuItem>
              </form>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild>
                <DropdownMenuItem 
                  onClick={() => setIsDeleteOpen(true)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Edit Dialog */}
          <DialogContent className={isEditOpen ? 'block' : 'hidden'}>
            <DialogHeader>
              <DialogTitle>Edit Payroll Set</DialogTitle>
            </DialogHeader>
            <form action={updatePayrollSet} className="space-y-4">
              <input type="hidden" name="payroll_set_id" value={payrollSet.payroll_set_id} />
              <input type="hidden" name="company_id" value={payrollSet.company_id} />
              
              <div>
                <Label htmlFor="set_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Set Name
                </Label>
                <Input
                  id="set_name"
                  name="set_name"
                  defaultValue={payrollSet.set_name}
                  required
                />
              </div>

              <div>
                <Label htmlFor="pay_frequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Pay Frequency
                </Label>
                <Select name="pay_frequency" defaultValue={payrollSet.pay_frequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAY_FREQUENCIES.map((frequency) => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="last_run_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Run Date <span className="text-gray-400">(optional)</span>
                </Label>
                <Input
                  id="last_run_date"
                  name="last_run_date"
                  type="date"
                  defaultValue={formatDateForInput(payrollSet.last_run_date)}
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

          {/* Delete Dialog */}
          <DialogContent className={isDeleteOpen ? 'block' : 'hidden'}>
            <DialogHeader>
              <DialogTitle>Delete Payroll Set</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete payroll set "{payrollSet.set_name}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <form action={deletePayrollSet} className="inline">
                  <input type="hidden" name="payroll_set_id" value={payrollSet.payroll_set_id} />
                  <input type="hidden" name="company_id" value={payrollSet.company_id} />
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
      </Dialog>
    </div>
  )
}