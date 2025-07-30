// /app/hr/admin/position-types/_components/position-types-client-page.tsx
"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { addPositionType, updatePositionType, deletePositionType } from "../actions";
import type { PositionType } from "../data";

type PositionTypesClientPageProps = {
  positionTypes: PositionType[];
};

export function PositionTypesClientPage({ positionTypes: initialPositionTypes }: PositionTypesClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPositionType, setCurrentPositionType] = useState<PositionType | null>(null);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const action = currentPositionType ? updatePositionType.bind(null, currentPositionType.position_type_id) : addPositionType;
    
    const result = await action(formData);
    if (result.error) {
        alert(result.error); // Replace with a toast notification
    } else {
        setIsModalOpen(false);
        setCurrentPositionType(null);
    }
  };

  const openAddModal = () => {
    setCurrentPositionType(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pt: PositionType) => {
    setCurrentPositionType(pt);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this position type?")) {
        const result = await deletePositionType(id);
        if (result.error) {
            alert(result.error);
        }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Position Types</h1>
          <p className="text-neutral-500">Create and manage job templates or role definitions.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Position Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentPositionType ? "Edit" : "Add"} Position Type</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={currentPositionType?.title || ""} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={currentPositionType?.description || ""} />
              </div>
              <Button type="submit" className="w-full">
                {currentPositionType ? "Save Changes" : "Create Position Type"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPositionTypes.map((pt) => (
              <TableRow key={pt.position_type_id}>
                <TableCell className="font-medium">{pt.title}</TableCell>
                <TableCell className="max-w-sm truncate">{pt.description}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditModal(pt)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(pt.position_type_id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
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
