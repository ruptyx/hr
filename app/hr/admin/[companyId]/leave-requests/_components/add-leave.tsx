import { createLeaveRequest } from '../actions'
import { LEAVE_TYPES } from '../constants'
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

interface AddLeaveRequestFormProps {
  companyId: number
}

export function AddLeaveRequestForm({ companyId }: AddLeaveRequestFormProps) {
  return (
    <form action={createLeaveRequest} className="space-y-4">
      <input type="hidden" name="company_id" value={companyId} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="employee_id" className="text-sm font-medium text-gray-700">
            Employee ID
          </Label>
          <Input
            id="employee_id"
            name="employee_id"
            type="number"
            placeholder="Enter employee ID"
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="leave_type" className="text-sm font-medium text-gray-700">
            Leave Type
          </Label>
          <Select name="leave_type" required>
            <SelectTrigger className="mt-1">
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
          <Label htmlFor="start_date" className="text-sm font-medium text-gray-700">
            Start Date
          </Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="end_date" className="text-sm font-medium text-gray-700">
            End Date
          </Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            required
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="remarks" className="text-sm font-medium text-gray-700">
          Remarks <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="remarks"
          name="remarks"
          placeholder="Additional notes or reason for leave..."
          className="mt-1"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
        >
          Submit Leave Request
        </Button>
      </div>
    </form>
  )
}