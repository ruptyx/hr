// /hr/admin/_components/metric-card.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MetricCardProps = {
  title: string;
  value: string;
  change?: string;
};

export function MetricCard({ title, value, change }: MetricCardProps) {
  return (
    <Card className="bg-neutral-50 border-neutral-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-neutral-600">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-black">{value}</div>
        {change && (
          <p className="text-xs text-neutral-500 mt-1">{change}</p>
        )}
      </CardContent>
    </Card>
  );
}