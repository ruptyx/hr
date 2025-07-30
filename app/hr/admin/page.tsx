// /hr/admin/page.tsx

import { MetricCard } from '@/app/hr/admin/_components/metric-card';
import { Activity, getAdminDashboardData } from './data'; // This function fetches data from your DB
import { QuickLinks } from '@/app/hr/admin/_components/quick-links';
import { ActivityFeed } from '@/app/hr/admin/_components/activity-feed';
import { OnboardingOffboardingList } from '@/app/hr/admin/_components/onboarding-offboarding-list';

// Define types based on component usage and DB function response.
// In a real app, these would likely live in a central types file (e.g., /hr/admin/data.ts)

// Data structure returned by the get_admin_dashboard_data postgres function
type OnboardingEmployeeData = {
  party_id: number;
  name_english: string;
  start_date: string;
  position_title: string;
  department_name: string;
};

type OffboardingEmployeeData = {
  party_id: number;
  name_english: string;
  end_date: string;
  position_title: string;
  department_name: string;
};

type PendingLeaveRequestData = {
    leave_request_id: number;
    employee_name: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    request_date: string;
};

type DashboardData = {
  metrics: {
    headcount: number;
    newHiresThisMonth: number;
    terminationsThisMonth: number;
    openPositions: number;
    pendingLeaveRequests: number;
  };
  onboardingList: OnboardingEmployeeData[];
  offboardingList: OffboardingEmployeeData[];
  pendingLeaveRequests: PendingLeaveRequestData[];
};

// The types expected by the child components
type Employee = {
    party_id: number;
    current_first_name: string;
    current_last_name: string;
    position_title: string;
    status: 'Onboarding' | 'Offboarding';
    start_date: string;
    end_date?: string;
};



export default async function HrAdminDashboardPage() {
  // Fetch the raw data from the database
  const rawData = await getAdminDashboardData() as DashboardData;

  // 1. Transform data for the OnboardingOffboardingList component
  // This ensures the data structure matches what the component expects
  const onboardingList: Employee[] = (rawData.onboardingList || []).map(emp => {
    const [firstName, ...lastNameParts] = emp.name_english.split(' ');
    return {
      party_id: emp.party_id,
      current_first_name: firstName || '',
      current_last_name: lastNameParts.join(' '),
      position_title: emp.position_title,
      status: 'Onboarding',
      start_date: emp.start_date,
    };
  });

  const offboardingList: Employee[] = (rawData.offboardingList || []).map(emp => {
    const [firstName, ...lastNameParts] = emp.name_english.split(' ');
    return {
      party_id: emp.party_id,
      current_first_name: firstName || '',
      current_last_name: lastNameParts.join(' '),
      position_title: emp.position_title,
      status: 'Offboarding',
      start_date: '', // Not relevant for offboarding but keeps the type consistent
      end_date: emp.end_date,
    };
  });

  // 2. Create a unified `activities` list for the ActivityFeed component
  const onboardingActivities: Activity[] = onboardingList.map(emp => ({
    id: `onboard-${emp.party_id}`,
    type: 'HIRE',
    description: `${emp.current_first_name} ${emp.current_last_name} started as ${emp.position_title}.`,
    date: emp.start_date,
  }));

  const offboardingActivities: Activity[] = offboardingList.map(emp => ({
    id: `offboard-${emp.party_id}`,
    type: 'TERMINATION',
    description: `${emp.current_first_name} ${emp.current_last_name} is scheduled for departure.`,
    date: emp.end_date!,
  }));
  
  const pendingLeaveActivities: Activity[] = (rawData.pendingLeaveRequests || []).map(req => ({
      id: `leave-${req.leave_request_id}`,
      type: 'PAYROLL', // Using PAYROLL icon for leave requests
      description: `${req.employee_name} requested ${req.leave_type} leave.`,
      date: req.request_date,
  }));

  // Combine all activities and sort them by date, most recent first
  const activities: Activity[] = [...onboardingActivities, ...offboardingActivities, ...pendingLeaveActivities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-white text-black">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">HR Admin Dashboard</h1>
        <p className="text-neutral-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <main>
        {/* Section 1: Key Metrics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Headcount" value={rawData.metrics.headcount.toString()} />
          <MetricCard title="New Hires (This Month)" value={rawData.metrics.newHiresThisMonth.toString()} />
          <MetricCard title="Terminations (This Month)" value={rawData.metrics.terminationsThisMonth.toString()} />
          <MetricCard title="Open Positions" value={rawData.metrics.openPositions.toString()} />
        </section>

        {/* Section 2: Main Content Area */}
        <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <QuickLinks />
            {/* Pass the newly created and sorted activities list */}
            <ActivityFeed activities={activities} />
          </div>
          <div className="lg:col-span-1">
            {/* Pass the transformed lists */}
            <OnboardingOffboardingList 
              onboarding={onboardingList} 
              offboarding={offboardingList} 
            />
          </div>
        </section>
      </main>
    </div>
  );
}
