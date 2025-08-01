// /app/hr/admin/position-types/page.tsx

import { BackButton } from "@/components/shared/back-button";
import { PositionTypesClientPage } from "./_components/position-client-page";
import { getPositionTypes } from "./data";

export default async function ManagePositionTypesPage() {
  const positionTypes = await getPositionTypes();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <BackButton />
      </div>
      <PositionTypesClientPage positionTypes={positionTypes} />
    </div>
  );
}
