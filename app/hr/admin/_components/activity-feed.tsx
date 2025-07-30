// /hr/admin/_components/activity-feed.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, UserPlus, UserMinus, CircleDollarSign, FileText } from "lucide-react";
import { Activity } from "../data";

const iconMap: { [key: string]: React.ReactNode } = {
  HIRE: <UserPlus className="h-5 w-5 text-green-600" />,
  TERMINATION: <UserMinus className="h-5 w-5 text-red-600" />,
  PROMOTION: <Briefcase className="h-5 w-5 text-blue-600" />,
  PAYROLL: <FileText className="h-5 w-5 text-purple-600" />, // Changed icon for leave
  DEFAULT: <CircleDollarSign className="h-5 w-5 text-neutral-600" />,
};

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `just now`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}

// Added a default empty array to the activities prop to prevent crashes
export function ActivityFeed({ activities = [] }: { activities: Activity[] }) {
  return (
    <Card className="bg-neutral-50 border-neutral-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200">
                  {iconMap[activity.type] || iconMap.DEFAULT}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-neutral-800">{activity.description}</p>
                  <p className="text-xs text-neutral-500">{formatRelativeTime(activity.date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-neutral-500">
            No recent activity to display.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
