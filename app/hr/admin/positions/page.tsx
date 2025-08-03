// /app/hr/admin/designations/page.tsx

import { BackButton } from "@/components/shared/back-button";
import { getDesignations } from "./data";
import { DesignationsClientPage } from "@/app/hr/admin/positions/_components/position-client-page";

export default async function ManageDesignationsPage() {
  const designations = await getDesignations();
  
  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <BackButton />
      </div>
      <DesignationsClientPage designations={designations} />
    </div>
  );
}