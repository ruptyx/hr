// /app/hr/admin/employees/new/_components/step-indicator.tsx

const steps = ["Personal Information", "Employment Details", "Review & Submit"];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold
                ${isActive ? 'bg-black text-white' : ''}
                ${isCompleted ? 'bg-neutral-300 text-neutral-700' : ''}
                ${!isActive && !isCompleted ? 'bg-neutral-200 text-neutral-500' : ''}
              `}
            >
              {stepNumber}
            </div>
            <span className={`text-sm ${isActive ? 'font-semibold text-black' : 'text-neutral-500'}`}>
              {label}
            </span>
            {stepNumber < steps.length && (
              <div className="w-16 h-px bg-neutral-300 mx-4" />
            )}
          </div>
        );
      })}
    </div>
  );
}