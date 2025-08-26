import { createHoliday } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddHolidayFormProps {
  companyId: number
}

export function AddHolidayForm({ companyId }: AddHolidayFormProps) {
  return (
    <form action={createHoliday} className="flex items-end gap-4">
      <input type="hidden" name="company_id" value={companyId} />
      
      <div className="flex-1">
        <Label htmlFor="holiday_name" className="text-sm font-medium text-gray-700">
          Holiday Name
        </Label>
        <Input
          id="holiday_name"
          name="holiday_name"
          type="text"
          placeholder="e.g. New Year's Day, Christmas"
          required
          className="mt-1"
        />
      </div>
      
      <div className="min-w-[200px]">
        <Label htmlFor="holiday_date" className="text-sm font-medium text-gray-700">
          Holiday Date
        </Label>
        <Input
          id="holiday_date"
          name="holiday_date"
          type="date"
          required
          className="mt-1"
        />
      </div>
      
      <Button 
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
      >
        Add Holiday
      </Button>
    </form>
  )
}