// /hr/admin/_components/onboarding-offboarding-list.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Employee } from '../data';

function EmployeeListItem({ employee }: { employee: Employee }) {
    const initials = `${employee.current_first_name[0] || ''}${employee.current_last_name[0] || ''}`;
    const keyDate = employee.status === 'Onboarding' ? `Starts: ${new Date(employee.start_date).toLocaleDateString()}` : `Exits: ${new Date(employee.end_date!).toLocaleDateString()}`;

    return (
        <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${employee.current_first_name} ${employee.current_last_name}`} />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="text-sm font-medium truncate text-neutral-800">{employee.current_first_name} {employee.current_last_name}</p>
                <p className="text-xs text-neutral-500 truncate">{employee.position_title}</p>
            </div>
            <p className="text-xs text-neutral-600 whitespace-nowrap">{keyDate}</p>
        </div>
    )
}

export function OnboardingOffboardingList({ onboarding, offboarding }: { onboarding: Employee[], offboarding: Employee[] }) {
  return (
    <Card className="bg-neutral-50 border-neutral-200 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black">Employee Lifecycle</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="onboarding" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-neutral-200">
            <TabsTrigger value="onboarding">Onboarding ({onboarding.length})</TabsTrigger>
            <TabsTrigger value="offboarding">Offboarding ({offboarding.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="onboarding" className="mt-4">
             <div className="space-y-4">
                {onboarding.length > 0 ? (
                    onboarding.map(emp => <EmployeeListItem key={emp.party_id} employee={emp} />)
                ) : (
                    <p className="text-sm text-center text-neutral-500 py-4">No employees are currently onboarding.</p>
                )}
             </div>
          </TabsContent>
          <TabsContent value="offboarding" className="mt-4">
            <div className="space-y-4">
                {offboarding.length > 0 ? (
                    offboarding.map(emp => <EmployeeListItem key={emp.party_id} employee={emp} />)
                ) : (
                    <p className="text-sm text-center text-neutral-500 py-4">No employees are currently offboarding.</p>
                )}
             </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}