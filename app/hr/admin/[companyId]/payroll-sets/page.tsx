import { AddPayrollSetForm } from "./_components/add-payroll"
import { PayrollSetsHeader } from "./_components/payroll-sets-header"
import { PayrollSetsTable } from "./_components/payroll-table"
import { getPayrollSets } from "./data"

interface PageProps {
  params: Promise<{
    companyId: string
  }>
}

export default async function PayrollSetsPage({ params }: PageProps) {
  const { companyId } = await params
  const payrollSets = await getPayrollSets(parseInt(companyId))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <PayrollSetsHeader />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8">
        <div className="space-y-6">
          {/* Add Payroll Set Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Add New Payroll Set</h2>
              <AddPayrollSetForm companyId={parseInt(companyId)} />
            </div>
          </div>

          {/* Payroll Sets Table Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Payroll Sets</h2>
                <div className="text-sm text-gray-500">
                  {payrollSets.length} payroll set{payrollSets.length !== 1 ? 's' : ''}
                </div>
              </div>
              <PayrollSetsTable payrollSets={payrollSets} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}