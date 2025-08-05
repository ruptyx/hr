import { AddDepartmentForm } from './_components/department-add-form'
import { DepartmentsHeader } from './_components/department-header'
import { DepartmentsTable } from './_components/departments-table'
import { getDepartments } from './data'

interface PageProps {
  params: Promise<{
    companyId: string
  }>
}

export default async function DepartmentsPage({ params }: PageProps) {
  const { companyId } = await params
  const departments = await getDepartments(parseInt(companyId))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <DepartmentsHeader />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8">
        <div className="space-y-6">
          {/* Add Department Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Add New Department</h2>
              <AddDepartmentForm companyId={parseInt(companyId)} departments={departments} />
            </div>
          </div>

          {/* Departments Table Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">All Departments</h2>
                <div className="text-sm text-gray-500">
                  {departments.length} department{departments.length !== 1 ? 's' : ''}
                </div>
              </div>
              <DepartmentsTable departments={departments} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}