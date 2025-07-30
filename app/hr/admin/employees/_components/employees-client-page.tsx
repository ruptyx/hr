// /app/hr/employees/_components/employees-client-page.tsx
"use client";

import { useState, useMemo } from 'react';
import type { Employee } from '../data';
import { Search } from './search';
import { EmployeesList } from './employees-list';

type EmployeesClientPageProps = {
  employees: Employee[];
};

export function EmployeesClientPage({ employees }: EmployeesClientPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) {
      return employees;
    }
    return employees.filter(employee =>
      employee.name_english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [employees, searchTerm]);

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-neutral-500">
            View, search, and manage employee records.
          </p>
        </div>
      </div>
      <Search
        placeholder="Search employees by name or email..."
        onSearchChange={setSearchTerm}
      />
      <EmployeesList employees={filteredEmployees} />
    </>
  );
}
