import { createDepartment } from '../actions'
import { Department } from '../data'
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

interface AddDepartmentFormProps {
  companyId: number
  departments: Department[]
}

export function AddDepartmentForm({ companyId, departments }: AddDepartmentFormProps) {
  return (
    <form action={createDepartment} className="flex items-end gap-4">
      <input type="hidden" name="company_id" value={companyId} />
      
      <div className="flex-1">
        <Label htmlFor="department_name" className="text-sm font-medium text-gray-700">
          Department Name
        </Label>
        <Input
          id="department_name"
          name="department_name"
          type="text"
          placeholder="e.g. Engineering, Marketing, Sales"
          required
          className="mt-1"
        />
      </div>
      
      <div className="min-w-[200px]">
        <Label htmlFor="parent_id" className="text-sm font-medium text-gray-700">
          Parent Department
        </Label>
        <Select name="parent_id">
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select parent (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Parent (Top Level)</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                {dept.department_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
      >
        Add Department
      </Button>
    </form>
  )
}