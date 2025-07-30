// /hr/admin/page.tsx

import { MetricCard } from '@/app/hr/admin/_components/metric-card';
import { getAdminDashboardData } from './data';
import { QuickLinks } from '@/app/hr/admin/_components/quick-links';
import { ActivityFeed } from '@/app/hr/admin/_components/activity-feed';
import { OnboardingOffboardingList } from '@/app/hr/admin/_components/onboarding-offboarding-list';

export default async function HrAdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-white text-black">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">HR Admin Dashboard</h1>
        <p className="text-neutral-500">
          Wednesday, July 30, 2025
        </p>
      </header>

      <main>
        {/* Section 1: Key Metrics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Headcount" value={data.metrics.headcount.toString()} />
          <MetricCard title="New Hires (This Month)" value={data.metrics.newHiresThisMonth.toString()} />
          <MetricCard title="Terminations (This Month)" value={data.metrics.terminationsThisMonth.toString()} />
          <MetricCard title="Open Positions" value={data.metrics.openPositions.toString()} />
        </section>

        {/* Section 2: Main Content Area */}
        <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <QuickLinks />
            <ActivityFeed activities={data.activities} />
          </div>
          <div className="lg:col-span-1">
            <OnboardingOffboardingList 
              onboarding={data.onboardingList} 
              offboarding={data.offboardingList} 
            />
          </div>
        </section>
      </main>
    </div>
  );
}