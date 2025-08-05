import { AddHolidayForm } from "./_components/add-holiday-form"
import { HolidaysHeader } from "./_components/holidays-header"
import { HolidaysTable } from "./_components/holidays-table"
import { getHolidays } from "./data"

interface PageProps {
  params: Promise<{
    companyId: string
  }>
}

export default async function HolidaysPage({ params }: PageProps) {
  const { companyId } = await params
  const holidays = await getHolidays(parseInt(companyId))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <HolidaysHeader />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8">
        <div className="space-y-6">
          {/* Add Holiday Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Add New Holiday</h2>
              <AddHolidayForm companyId={parseInt(companyId)} />
            </div>
          </div>

          {/* Holidays Table Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Company Holidays</h2>
                <div className="text-sm text-gray-500">
                  {holidays.length} holiday{holidays.length !== 1 ? 's' : ''}
                </div>
              </div>
              <HolidaysTable holidays={holidays} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}