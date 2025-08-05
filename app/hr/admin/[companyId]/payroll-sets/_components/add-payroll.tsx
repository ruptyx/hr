import { createPayrollSet } from '../actions'
import { PAY_FREQUENCIES } from '../constants'
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

interface AddPayrollSetFormProps {
  companyId: number
}

export function AddPayrollSetForm({ companyId }: AddPayrollSetFormProps) {
  return (
    <form action={createPayrollSet} className="flex items-end gap-4">
      <input type="hidden" name="company_id" value={companyId} />
      
      <div className="flex-1">
        <Label htmlFor="set_name" className="text-sm font-medium text-gray-700">
          Payroll Set Name
        </Label>
        <Input
          id="set_name"
          name="set_name"
          type="text"
          placeholder="e.g. Regular Employees, Contractors, Executive"
          required
          className="mt-1"
        />
      </div>
      
      <div className="min-w-[180px]">
        <Label htmlFor="pay_frequency" className="text-sm font-medium text-gray-700">
          Pay Frequency
        </Label>
        <Select name="pay_frequency" defaultValue="Monthly">
          <SelectTrigger className="mt-1">
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
      
      <Button 
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
      >
        Add Payroll Set
      </Button>
    </form>
  )
}