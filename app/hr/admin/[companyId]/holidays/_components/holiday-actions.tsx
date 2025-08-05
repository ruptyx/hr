'use client'

import { useState } from 'react'
import { Holiday } from '../data'
import { updateHoliday, deleteHoliday } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'

interface HolidayActionsProps {
  holiday: Holiday
}

export function HolidayActions({ holiday }: HolidayActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
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
              <DialogTitle>Edit Holiday</DialogTitle>
            </DialogHeader>
            <form action={updateHoliday} className="space-y-4">
              <input type="hidden" name="holiday_id" value={holiday.holiday_id} />
              <input type="hidden" name="company_id" value={holiday.company_id} />
              
              <div>
                <Label htmlFor="holiday_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Holiday Name
                </Label>
                <Input
                  id="holiday_name"
                  name="holiday_name"
                  defaultValue={holiday.holiday_name}
                  required
                />
              </div>

              <div>
                <Label htmlFor="holiday_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Holiday Date
                </Label>
                <Input
                  id="holiday_date"
                  name="holiday_date"
                  type="date"
                  defaultValue={formatDateForInput(holiday.holiday_date)}
                  required
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
              <DialogTitle>Delete Holiday</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete "{holiday.holiday_name}" on {new Date(holiday.holiday_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <form action={deleteHoliday} className="inline">
                  <input type="hidden" name="holiday_id" value={holiday.holiday_id} />
                  <input type="hidden" name="company_id" value={holiday.company_id} />
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