import { getDesignations } from './data'
import { DesignationsHeader } from './_components/designations-header'
import { DesignationsTable } from './_components/designations-table'
import { AddDesignationForm } from './_components/designations-form'

interface PageProps {
  params: Promise<{
    companyId: string
  }>
}

export default async function DesignationsPage({ params }: PageProps) {
  const { companyId } = await params
  const designations = await getDesignations(parseInt(companyId))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <DesignationsHeader />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8">
        <div className="space-y-6">
          {/* Add Designation Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Add New Designation</h2>
              <AddDesignationForm companyId={parseInt(companyId)} />
            </div>
          </div>

          {/* Designations Table Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">All Designations</h2>
                <div className="text-sm text-gray-500">
                  {designations.length} designation{designations.length !== 1 ? 's' : ''}
                </div>
              </div>
              <DesignationsTable designations={designations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}