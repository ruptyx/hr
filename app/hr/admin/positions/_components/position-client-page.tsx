"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addPositionType, updatePositionType, deletePositionType } from "../actions";
import { positionSchema } from "../schemas";
import type { PositionType } from "../data";

type PositionTypesClientPageProps = {
  positionTypes: PositionType[];
};

export function PositionTypesClientPage({
  positionTypes: initialPositionTypes,
}: PositionTypesClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPositionType, setCurrentPositionType] =
    useState<PositionType | null>(null);

  const form = useForm<z.infer<typeof positionSchema>>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof positionSchema>) => {
    const formData = new FormData();
    formData.append("title", values.title);
    if (values.description) {
      formData.append("description", values.description);
    }

    const action = currentPositionType
      ? updatePositionType.bind(null, currentPositionType.position_type_id)
      : addPositionType;

    const result = await action(formData);

    if (result.error) {
      // Handle error (e.g., show toast notification)
      console.error(result.error);
    } else {
      setIsModalOpen(false);
      form.reset();
      // Refresh data would happen here in a real app
    }
  };

  const openAddModal = () => {
    setCurrentPositionType(null);
    form.reset();
    setIsModalOpen(true);
  };

  const openEditModal = (pt: PositionType) => {
    setCurrentPositionType(pt);
    form.reset({ title: pt.title, description: pt.description || "" });
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
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Position Types
          </h1>
          <p className="text-neutral-500">
            Create and manage job templates or role definitions.
          </p>
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
              <DialogTitle>
                {currentPositionType ? "Edit" : "Add"} Position Type
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="title">Title</Label>
                <Input {...form.register("title")} />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea {...form.register("description")} />
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
                <TableCell className="max-w-sm truncate">
                  {pt.description}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditModal(pt)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(pt.position_type_id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
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