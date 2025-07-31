'use client';

import { useState } from "react";
import { useFormState, useFormStatus } from 'react-dom';
import { createEmployee, type FormState } from '../actions';
import { StepIndicator } from "./step-indicator";
import { Step1Personal } from "./step-1-personal";
import { Step2Employment } from "./step-2-employment";
import { Step3Review } from "./step-3-review";
import { Button } from "@/components/ui/button";
import type { Department, PositionTypeForForm, Manager } from '../data';
import { format } from 'date-fns';

type AddEmployeeFormProps = {
  departments: Department[];
  positionTypes: PositionTypeForForm[];
  managers: Manager[];
};

export type FormData = {
  nameEnglish: string;
  nameArabic: string;
  dob: Date | undefined;
  gender: string;
  maritalStatus: string;
  nationality: string;
  mobileDialCode: string;
  mobileNumber: string;
  email: string;
  emergencyContactNumber: string;
  religion: string;
  bloodGroup: string;
  departmentId: string;
  positionTypeId: string;
  managerId: string; // New manager field
  startDate: Date | undefined;
  employmentType: 'Salaried' | 'Hourly';
  salaryFlag: boolean;
};

const initialFormData: FormData = {
  nameEnglish: "",
  nameArabic: "",
  dob: undefined,
  gender: "",
  maritalStatus: "",
  nationality: "Kuwaiti",
  mobileDialCode: "+965",
  mobileNumber: "",
  email: "",
  emergencyContactNumber: "",
  religion: "",
  bloodGroup: "",
  departmentId: "",
  positionTypeId: "",
  managerId: "", // New manager field
  startDate: undefined,
  employmentType: 'Salaried',
  salaryFlag: true,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-48">
      {pending ? 'Creating Profile...' : 'Create Employee Profile'}
    </Button>
  );
}

export function AddEmployeeForm({ departments, positionTypes, managers }: AddEmployeeFormProps) {
  const [step, setStep] = useState(1);
  const [localFormData, setLocalFormData] = useState(initialFormData);

  const initialState: FormState = { message: '' };
  const [formState, dispatch] = useFormState(createEmployee, initialState);

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const updateLocalFormData = (newData: Partial<typeof initialFormData>) => {
    setLocalFormData((prev) => ({ ...prev, ...newData }));
  };
  
  return (
    <form action={dispatch} className="space-y-8">
      <StepIndicator currentStep={step} />

      <div className="p-8 border rounded-lg bg-neutral-50 border-neutral-200 min-h-[400px]">
        {step === 1 && <Step1Personal formData={localFormData} updateFormData={updateLocalFormData} errors={formState.errors} />}
        {step === 2 && <Step2Employment formData={localFormData} updateFormData={updateLocalFormData} departments={departments} positionTypes={positionTypes} managers={managers} errors={formState.errors} />}
        {step === 3 && <Step3Review formData={localFormData} departments={departments} positionTypes={positionTypes} managers={managers} />}
      </div>

      {formState.message && !formState.errors && (
         <p className="text-sm text-red-500 text-center">{formState.message}</p>
      )}
       {formState.message && formState.errors && (
         <p className="text-sm text-red-500 text-center">Please correct the errors in the form and try again.</p>
      )}

      <div className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" type="button" onClick={handlePrev}>Previous Step</Button>
        ) : <div />}
        
        {step < 3 ? (
          <Button type="button" onClick={handleNext}>Next Step</Button>
        ) : (
          <SubmitButton />
        )}
      </div>
      
      {/* Hidden inputs to pass all local state to the server action */}
      <input type="hidden" name="nameEnglish" value={localFormData.nameEnglish} />
      <input type="hidden" name="nameArabic" value={localFormData.nameArabic} />
      {localFormData.dob && <input type="hidden" name="dob" value={format(localFormData.dob, "yyyy-MM-dd")} />}
      <input type="hidden" name="gender" value={localFormData.gender} />
      <input type="hidden" name="maritalStatus" value={localFormData.maritalStatus} />
      <input type="hidden" name="nationality" value={localFormData.nationality} />
      <input type="hidden" name="mobileNumber" value={`${localFormData.mobileDialCode}${localFormData.mobileNumber}`} />
      <input type="hidden" name="email" value={localFormData.email} />
      <input type="hidden" name="emergencyContactNumber" value={localFormData.emergencyContactNumber} />
      <input type="hidden" name="religion" value={localFormData.religion} />
      <input type="hidden" name="bloodGroup" value={localFormData.bloodGroup} />
      <input type="hidden" name="departmentId" value={localFormData.departmentId} />
      <input type="hidden" name="positionTypeId" value={localFormData.positionTypeId} />
      <input type="hidden" name="managerId" value={localFormData.managerId} />
      {localFormData.startDate && <input type="hidden" name="joinDate" value={format(localFormData.startDate, "yyyy-MM-dd")} />}
      <input type="hidden" name="employmentType" value={localFormData.employmentType} />
    </form>
  );
}