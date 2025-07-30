// /app/hr/admin/salary-components/_components/salary-components-client-page.tsx
"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, PlusCircle, Trash2, Edit, BadgeCheck, BadgeX } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { addSalaryComponentType, updateSalaryComponentType, deleteSalaryComponentType } from "../actions";
import type { SalaryComponentType } from "../data";

type SalaryComponentsClientPageProps = {
  salaryComponents: SalaryComponentType[];
};

export function SalaryComponentsClientPage({ salaryComponents: initialComponents }: SalaryComponentsClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<SalaryComponentType | null>(null);

  // Sort components by display_order for consistent display, even though the order is not shown.
  const sortedComponents = [...initialComponents].sort((a, b) => a.display_order - b.display_order);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    // For updates, we must preserve the existing display_order value since it's removed from the form.
    // For new components, the server action will assign a default value.
    if (currentComponent) {
        formData.set('display_order', String(currentComponent.display_order));
    }

    const action = currentComponent ? updateSalaryComponentType.bind(null, currentComponent.component_type_id) : addSalaryComponentType;
    
    const result = await action(formData);
    if (result.error) {
        alert(result.error); // TODO: Replace with a toast notification for better UX
    } else {
        setIsModalOpen(false);
        setCurrentComponent(null);
    }
  };

  const openAddModal = () => {
    setCurrentComponent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sc: SalaryComponentType) => {
    setCurrentComponent(sc);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this salary component?")) {
        const result = await deleteSalaryComponentType(id);
        if (result.error) {
            alert(result.error); // TODO: Replace with a toast notification
        }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Salary Components</h1>
          <p className="text-neutral-500">Define earnings and deductions for payroll processing.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Component
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentComponent ? "Edit" : "Add"} Salary Component</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* The Component Name is now the only field in this row */}
              <div>
                <Label htmlFor="name">Component Name</Label>
                <Input id="name" name="name" defaultValue={currentComponent?.name || ""} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={currentComponent?.description || ""} />
              </div>
              <div className="flex items-center space-x-4 pt-2">
                 <div className="flex items-center space-x-2">
                    <Checkbox id="is_basic_salary" name="is_basic_salary" defaultChecked={currentComponent?.is_basic_salary} />
                    <Label htmlFor="is_basic_salary">Is Basic Salary</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="is_taxable" name="is_taxable" defaultChecked={currentComponent?.is_taxable ?? true} />
                    <Label htmlFor="is_taxable">Is Taxable</Label>
                </div>
              </div>
              
              <div className="p-4 border rounded-md space-y-4 bg-neutral-50">
                <h3 className="font-semibold text-md">Financial Integration (Defaults)</h3>
                <div>
                    <Label htmlFor="main_account_code">Main Account Code</Label>
                    <Input id="main_account_code" name="main_account_code" defaultValue={currentComponent?.main_account_code || ""} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="dimension_1">Dimension 1</Label><Input id="dimension_1" name="dimension_1" defaultValue={currentComponent?.dimension_1 || ""} /></div>
                    <div><Label htmlFor="dimension_2">Dimension 2</Label><Input id="dimension_2" name="dimension_2" defaultValue={currentComponent?.dimension_2 || ""} /></div>
                    <div><Label htmlFor="dimension_3">Dimension 3</Label><Input id="dimension_3" name="dimension_3" defaultValue={currentComponent?.dimension_3 || ""} /></div>
                    <div><Label htmlFor="dimension_4">Dimension 4</Label><Input id="dimension_4" name="dimension_4" defaultValue={currentComponent?.dimension_4 || ""} /></div>
                </div>
                 <div><Label htmlFor="dimension_5">Dimension 5</Label><Input id="dimension_5" name="dimension_5" defaultValue={currentComponent?.dimension_5 || ""} /></div>
              </div>
              
              <Button type="submit" className="w-full !mt-8">
                {currentComponent ? "Save Changes" : "Create Component"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {/* The "Order" column has been removed from the display */}
              <TableHead>Name</TableHead>
              <TableHead>Is Basic</TableHead>
              <TableHead>Is Taxable</TableHead>
              <TableHead>Account Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* We now map over the sortedComponents array */}
            {sortedComponents.map((sc) => (
              <TableRow key={sc.component_type_id}>
                {/* The cell for display_order has been removed */}
                <TableCell className="font-medium">{sc.name}</TableCell>
                <TableCell>{sc.is_basic_salary ? <BadgeCheck className="text-green-600" /> : <BadgeX className="text-neutral-400" />}</TableCell>
                <TableCell>{sc.is_taxable ? <BadgeCheck className="text-green-600" /> : <BadgeX className="text-neutral-400" />}</TableCell>
                <TableCell>{sc.main_account_code || '—'}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditModal(sc)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(sc.component_type_id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
