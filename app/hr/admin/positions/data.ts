// /app/hr/admin/position-types/data.ts
"use server";

import { createClient } from "@/utils/supabase/server";

// Simplified type definition for a single position type object.
export type PositionType = {
  position_type_id: number;
  title: string | null;
  description: string | null;
  created_date: string;
};

/**
 * Fetches all position types from the database using an RPC call.
 * @returns A promise that resolves to an array of PositionType objects.
 */
export async function getPositionTypes(): Promise<PositionType[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_all_position_types');

    if (error) {
        console.error("Error fetching position types:", error);
        return [];
    }
    
    return (data as PositionType[]) || [];
}
