// /app/hr/admin/employees/new/_components/step-3-review.tsx
import type { FormData } from "./add-employee-form";
import { format } from "date-fns";

type Department = { department_id: number; department_name: string };
type Position = { position_id: number; title: string; department_id: number };

type StepProps = {
  formData: FormData;
  departments: Department[];
  positions: Position[];
};

function ReviewItem({ label, value, isRtl = false }: { label: string; value?: string | null, isRtl?: boolean }) {
    return (
        <div className="grid grid-cols-3 gap-4 border-b border-neutral-200 py-3">
            <dt className="text-sm font-medium text-neutral-500">{label}</dt>
            <dd className={`text-sm text-neutral-900 col-span-2 ${isRtl ? 'dir-rtl text-right' : ''}`}>{value || 'N/A'}</dd>
        </div>
    )
}

export function Step3Review({ formData, departments, positions }: StepProps) {
    const departmentName = departments.find(d => d.department_id.toString() === formData.departmentId)?.department_name;
    const positionTitle = positions.find(p => p.position_id.toString() === formData.positionId)?.title;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review & Submit</h2>
      <p className="text-sm text-neutral-600">Please review all the information carefully before creating the employee profile.</p>
      
      <div className="space-y-8">
        <div>
            <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
            <dl className="space-y-0">
                <ReviewItem label="Name (English)" value={formData.nameEnglish} />
                <ReviewItem label="Name (Arabic)" value={formData.nameArabic} isRtl={true} />
                {/* ... other personal info review items ... */}
                 <ReviewItem label="Email ID" value={formData.email} />
            </dl>
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-2">Employment Details</h3>
             <dl className="space-y-0">
                <ReviewItem label="Department" value={departmentName} />
                <ReviewItem label="Position / Title" value={positionTitle} />
                {/* Label updated for clarity */}
                <ReviewItem label="Company Join Date" value={formData.startDate ? format(formData.startDate, "PPP") : 'N/A'} />
                <ReviewItem label="Employment Type" value={formData.employmentType} />
            </dl>
        </div>
      </div>
    </div>
  );
}