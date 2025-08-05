export function HolidaysHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Holidays</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage company holidays and observances
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Future: Add import holidays, export, or other action buttons here */}
      </div>
    </div>
  )
}