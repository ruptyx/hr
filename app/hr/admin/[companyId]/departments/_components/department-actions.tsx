'use client'

import { useState } from 'react'
import { Department } from '../data'
import { updateDepartment, deleteDepartment } from '../actions'
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

interface DepartmentActionsProps {
  department: Department
  allDepartments: Department[]
}

export function DepartmentActions({ department, allDepartments }: DepartmentActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Filter out departments that would create circular references
  const availableParents = allDepartments.filter(dept => {
    // Can't set itself as parent
    if (dept.department_id === department.department_id) return false
    
    // Can't set any of its children as parent (prevents circular reference)
    const isChild = (parentId: number, targetId: number): boolean => {
      const children = allDepartments.filter(d => d.parent_id === parentId)
      return children.some(child => 
        child.department_id === targetId || isChild(child.department_id, targetId)
      )
    }
    
    return !isChild(department.department_id, dept.department_id)
  })

  const hasChildren = allDepartments.some(dept => dept.parent_id === department.department_id)

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
                  disabled={hasChildren}
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
              <DialogTitle>Edit Department</DialogTitle>
            </DialogHeader>
            <form action={updateDepartment} className="space-y-4">
              <input type="hidden" name="department_id" value={department.department_id} />
              <input type="hidden" name="company_id" value={department.company_id} />
              
              <div>
                <Label htmlFor="department_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name
                </Label>
                <Input
                  id="department_name"
                  name="department_name"
                  defaultValue={department.department_name}
                  required
                />
              </div>

              <div>
                <Label htmlFor="parent_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Department
                </Label>
                <Select name="parent_id" defaultValue={department.parent_id?.toString() || "none"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Parent (Top Level)</SelectItem>
                    {availableParents.map((dept) => (
                      <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                        {dept.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <DialogTitle>Delete Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {hasChildren ? (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    Cannot delete "{department.department_name}" because it has sub-departments. 
                    Please move or delete the sub-departments first.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete "{department.department_name}"? This action cannot be undone.
                  </p>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDeleteOpen(false)}
                    >
                      Cancel
                    </Button>
                    <form action={deleteDepartment} className="inline">
                      <input type="hidden" name="department_id" value={department.department_id} />
                      <input type="hidden" name="company_id" value={department.company_id} />
                      <Button 
                        type="submit"
                        variant="destructive"
                        onClick={() => setIsDeleteOpen(false)}
                      >
                        Delete
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Dialog>
    </div>
  )
}