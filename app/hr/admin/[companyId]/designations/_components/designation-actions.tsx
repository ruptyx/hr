'use client'

import { useState } from 'react'
import { Designation } from '../data'
import { updateDesignation, deleteDesignation } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

interface DesignationActionsProps {
  designation: Designation
}

export function DesignationActions({ designation }: DesignationActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

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
              <DialogTitle>Edit Designation</DialogTitle>
            </DialogHeader>
            <form action={updateDesignation} className="space-y-4">
              <input type="hidden" name="designation_id" value={designation.designation_id} />
              <input type="hidden" name="company_id" value={designation.company_id} />
              
              <div>
                <label htmlFor="designation_title" className="block text-sm font-medium text-gray-700 mb-1">
                  Designation Title
                </label>
                <Input
                  id="designation_title"
                  name="designation_title"
                  defaultValue={designation.designation_title}
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
              <DialogTitle>Delete Designation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete "{designation.designation_title}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <form action={deleteDesignation} className="inline">
                  <input type="hidden" name="designation_id" value={designation.designation_id} />
                  <input type="hidden" name="company_id" value={designation.company_id} />
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