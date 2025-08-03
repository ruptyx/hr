"use server";

import { createClient } from "@/utils/supabase/server";

// Type definition for a single payroll set, matching the database schema exactly
export type PayrollSet = {
  payroll_set_id: number;
  name: string;
  description: string | null;
  company_party_id: number | null;
  is_active: boolean | null;
  // The company name is retrieved via a relationship
  company_name: string | null;
};

// Type for organization, matching the database schema
export type Organization = {
  party_id: number;
  name: string | null;
  federal_tax_id_num: string | null;
  created_date: string | null;
  modified_date: string | null;
  created_by: string | null;
  modified_by: string | null;
};

// Simplified type for organization dropdown
export type OrganizationOption = {
  party_id: number;
  name: string | null;
};

// Database response type for payroll set with organization join
type PayrollSetWithOrganization = {
  payroll_set_id: number;
  name: string;
  description: string | null;
  company_party_id: number | null;
  is_active: boolean | null;
  organization: { name: string | null } | null;
};

/**
 * Fetches all payroll sets from the database.
 * It also joins with the 'organization' table to get the company name.
 * @returns A promise that resolves to an array of PayrollSet objects.
 */
export async function getPayrollSets(): Promise<PayrollSet[]> {
  const supabase = await createClient();
  
  // This query selects all fields from payroll_set and the 'name' from the related 'organization' table
  const { data, error } = await supabase
    .from('payroll_set')
    .select(`
      payroll_set_id,
      name,
      description,
      company_party_id,
      is_active,
      organization ( name )
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching payroll sets:", error);
    throw new Error(`Failed to fetch payroll sets: ${error.message}`);
  }
  
  if (!data) {
    return [];
  }

  // Type assertion and mapping to flatten the structure
  const typedData = data as PayrollSetWithOrganization[];
  
  return typedData.map(item => ({
    ...item,
    // Safely access the nested company name
    company_name: item.organization?.name ?? null,
  }));
}

/**
 * Fetches all organizations to populate the company selection dropdown in the form.
 * @returns A promise that resolves to an array of OrganizationOption objects.
 */
export async function getOrganizations(): Promise<OrganizationOption[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('organization')
    .select('party_id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching organizations:", error);
    throw new Error(`Failed to fetch organizations: ${error.message}`);
  }
  
  return data ?? [];
}

/**
 * Fetches a single payroll set by ID.
 * @param payrollSetId The ID of the payroll set to fetch.
 * @returns A promise that resolves to a PayrollSet object or null if not found.
 */
export async function getPayrollSetById(payrollSetId: number): Promise<PayrollSet | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('payroll_set')
    .select(`
      payroll_set_id,
      name,
      description,
      company_party_id,
      is_active,
      organization ( name )
    `)
    .eq('payroll_set_id', payrollSetId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error("Error fetching payroll set:", error);
    throw new Error(`Failed to fetch payroll set: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const typedData = data as PayrollSetWithOrganization;
  
  return {
    ...typedData,
    company_name: typedData.organization?.name ?? null,
  };
}