// /hr/admin/_components/activity-feed.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, UserPlus, UserMinus, CircleDollarSign } from "lucide-react";
import type { Activity } from '../data';

const iconMap = {
  HIRE: <UserPlus className="h-5 w-5 text-green-600" />,
  TERMINATION: <UserMinus className="h-5 w-5 text-red-600" />,
  PROMOTION: <Briefcase className="h-5 w-5 text-blue-600" />,
  PAYROLL: <CircleDollarSign className="h-5 w-5 text-neutral-600" />,
};

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 1) return `${diffInDays} days ago`;
    if (diffInDays === 1) return `1 day ago`;
    if (diffInHours > 1) return `${diffInHours} hours ago`;
    if (diffInHours === 1) return `1 hour ago`;
    if (diffInMinutes > 1) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes === 1) return `1 minute ago`;
    return `just now`;
}

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <Card className="bg-neutral-50 border-neutral-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200">
                {iconMap[activity.type]}
              </span>
              <div className="flex-1">
                <p className="text-sm text-neutral-800">{activity.description}</p>
                <p className="text-xs text-neutral-500">{formatRelativeTime(activity.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}