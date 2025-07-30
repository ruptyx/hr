// /app/hr/admin/position-types/page.tsx

import { PositionTypesClientPage } from "./_components/position-client-page";
import { getPositionTypes } from "./data";

export default async function ManagePositionTypesPage() {
  const positionTypes = await getPositionTypes();

  return (
    <div className="p-4 md:p-8 bg-white text-black">
      <PositionTypesClientPage positionTypes={positionTypes} />
    </div>
  );
}
