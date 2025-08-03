// Suggested path: /app/payroll/admin/payroll-sets/page.tsx

import { Suspense } from "react";
import { BackButton } from "@/components/shared/back-button";
import { getPayrollSets, getOrganizations } from "./data";
import { PayrollSetsClientPage } from "@/app/hr/admin/payroll-sets/_components/payroll-set-client";

// Loading component for the table data
function PayrollSetsLoading() {
  return (
    <div className="border rounded-lg">
      <div className="p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Content component that fetches data
async function PayrollSetsContent() {
  try {
    // Fetch initial data in parallel to optimize loading
    const [payrollSets, organizations] = await Promise.all([
      getPayrollSets(),
      getOrganizations(),
    ]);

    return (
      <PayrollSetsClientPage
        payrollSets={payrollSets}
        organizations={organizations}
      />
    );
  } catch (error) {
    console.error("Error loading payroll sets data:", error);
    return (
      <div className="border rounded-lg border-red-200 bg-red-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Data
        </h3>
        <p className="text-red-600">
          Failed to load payroll sets. Please try refreshing the page.
        </p>
        <p className="text-sm text-red-500 mt-2">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
      </div>
    );
  }
}

/**
 * The main page component for managing payroll sets.
 * This is a React Server Component (RSC) that uses Suspense for loading states.
 */
export default function ManagePayrollSetsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <Suspense fallback={<PayrollSetsLoading />}>
        <PayrollSetsContent />
      </Suspense>
    </div>
  );
}

// Metadata for the page (optional but recommended)
export const metadata = {
  title: "Manage Payroll Sets",
  description: "Create and manage payroll sets for grouping employees during payroll processing.",
};