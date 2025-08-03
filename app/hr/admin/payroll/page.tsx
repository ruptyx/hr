// Suggested path: /app/payroll/run/page.tsx

import { BackButton } from "@/components/shared/back-button";
import { getPayrollSets } from "./data";
import { getOrganizations } from "@/app/hr/admin/payroll-sets/data";
import { PayrollClientPage } from "./_components/payroll-client-page"; // Updated import path

/**
 * The main page component for running payroll.
 * This is a React Server Component (RSC) that fetches the initial data
 * needed for the page, such as the list of payroll sets.
 */
export default async function RunPayrollPage() {
  try {
    // Fetch data required for the selection controls on the page.
    const [payrollSetsResult, organizationsResult] = await Promise.allSettled([
      getPayrollSets(),
      getOrganizations(), // Assuming we might need this for bank file formats etc.
    ]);

    // Handle potential errors in data fetching
    const payrollSets = payrollSetsResult.status === 'fulfilled' 
      ? payrollSetsResult.value || [] 
      : [];
    
    const organizations = organizationsResult.status === 'fulfilled' 
      ? organizationsResult.value || [] 
      : [];

    // Log any errors for debugging
    if (payrollSetsResult.status === 'rejected') {
      console.error('Failed to fetch payroll sets:', payrollSetsResult.reason);
    }
    if (organizationsResult.status === 'rejected') {
      console.error('Failed to fetch organizations:', organizationsResult.reason);
    }

    return (
      <div className="p-4 md:p-8">
        <div className="mb-4">
          <BackButton />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Process Payroll</h1>
        
        {/* Show error message if no payroll sets are available */}
        {payrollSets.length === 0 && (
          <div className="p-4 text-yellow-700 bg-yellow-100 border border-yellow-400 rounded-lg mb-6">
            No payroll sets are currently available. Please create a payroll set first.
          </div>
        )}
        
        {/* The client component handles all user interaction, state management,
            and calls to server actions for processing. */}
        <PayrollClientPage
          payrollSets={payrollSets}
          // We can pass other initial data like bank formats if needed
        />
      </div>
    );
  } catch (error) {
    console.error('Error in RunPayrollPage:', error);
    
    return (
      <div className="p-4 md:p-8">
        <div className="mb-4">
          <BackButton />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Process Payroll</h1>
        
        <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-lg">
          An error occurred while loading the payroll page. Please try again later.
        </div>
      </div>
    );
  }
}