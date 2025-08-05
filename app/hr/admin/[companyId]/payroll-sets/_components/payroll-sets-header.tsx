export function PayrollSetsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Payroll Sets</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage payroll configurations and payment schedules
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Future: Add run payroll, reports, or other action buttons here */}
      </div>
    </div>
  )
}