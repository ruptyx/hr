export function DepartmentsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Departments</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage organizational departments and their hierarchy
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Future: Add export, import, or other action buttons here */}
      </div>
    </div>
  )
}