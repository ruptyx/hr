// /app/hr/admin/employees/new/_components/step-1-personal.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import type { FormData } from "./add-employee-form";

type StepProps = {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
};

export function Step1Personal({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-8">
      {/* --- Section 1: Identity Information --- */}
      <div>
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Identity Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-2">
            <Label htmlFor="nameEnglish">Name (English) <span className="text-red-500">*</span></Label>
            <Input id="nameEnglish" value={formData.nameEnglish} onChange={(e) => updateFormData({ nameEnglish: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameArabic">Name (Arabic)</Label>
            <Input id="nameArabic" value={formData.nameArabic} onChange={(e) => updateFormData({ nameArabic: e.target.value })} dir="rtl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-full justify-start text-left font-normal border-neutral-300">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dob ? format(formData.dob, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.dob} onSelect={(date) => updateFormData({ dob: date })} initialFocus /></PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Nationality</Label>
            <Select value={formData.nationality} onValueChange={(value) => updateFormData({ nationality: value })}>
              <SelectTrigger><SelectValue placeholder="Select nationality..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Kuwaiti">Kuwaiti</SelectItem>
                <SelectItem value="Saudi Arabian">Saudi Arabian</SelectItem>
                <SelectItem value="Egyptian">Egyptian</SelectItem>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="Filipino">Filipino</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => updateFormData({ gender: value })}>
              <SelectTrigger><SelectValue placeholder="Select gender..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* --- Section 2: Contact Information --- */}
      <div>
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number <span className="text-red-500">*</span></Label>
            <div className="flex gap-2">
              <Select value={formData.mobileDialCode} onValueChange={(value) => updateFormData({ mobileDialCode: value })}>
                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="+965">+965 (KW)</SelectItem>
                  <SelectItem value="+966">+966 (SA)</SelectItem>
                  <SelectItem value="+20">+20 (EG)</SelectItem>
                  <SelectItem value="+91">+91 (IN)</SelectItem>
                </SelectContent>
              </Select>
              <Input id="mobileNumber" type="tel" value={formData.mobileNumber} onChange={(e) => updateFormData({ mobileNumber: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email ID</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => updateFormData({ email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyContactNumber">Emergency Contact Number</Label>
            <Input id="emergencyContactNumber" type="tel" value={formData.emergencyContactNumber} onChange={(e) => updateFormData({ emergencyContactNumber: e.target.value })} />
          </div>
        </div>
      </div>

      {/* --- Section 3: Additional Details --- */}
      <div>
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Additional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <div className="space-y-2">
            <Label>Marital Status</Label>
            <Select value={formData.maritalStatus} onValueChange={(value) => updateFormData({ maritalStatus: value })}>
              <SelectTrigger><SelectValue placeholder="Select status..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Religion</Label>
            <Select value={formData.religion} onValueChange={(value) => updateFormData({ religion: value })}>
              <SelectTrigger><SelectValue placeholder="Select religion..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Islam">Islam</SelectItem>
                <SelectItem value="Christianity">Christianity</SelectItem>
                <SelectItem value="Hinduism">Hinduism</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Blood Group</Label>
            <Select value={formData.bloodGroup} onValueChange={(value) => updateFormData({ bloodGroup: value })}>
              <SelectTrigger><SelectValue placeholder="Select group..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem><SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem><SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem><SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem><SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}