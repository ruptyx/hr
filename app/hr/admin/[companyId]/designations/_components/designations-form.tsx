import { createDesignation } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddDesignationFormProps {
  companyId: number
}

export function AddDesignationForm({ companyId }: AddDesignationFormProps) {
  return (
    <form action={createDesignation} className="flex items-end gap-4">
      <input type="hidden" name="company_id" value={companyId} />
      
      <div className="flex-1">
        <Label htmlFor="designation_title" className="text-sm font-medium text-gray-700">
          Designation Title
        </Label>
        <Input
          id="designation_title"
          name="designation_title"
          type="text"
          placeholder="e.g. Software Engineer, Marketing Manager"
          required
          className="mt-1"
        />
      </div>
      
      <Button 
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
      >
        Add Designation
      </Button>
    </form>
  )
}