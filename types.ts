export type Employment = {
  from_party_role_id: number;
  to_party_role_id: number;
  from_date: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

export type LeaveType = {
  leave_type_id: number;
  name: string;
  description?: string;
  is_paid?: boolean;
  accrual_rate?: number;
  max_accrual_hours?: number;
  carryover_allowed?: boolean;
  max_carryover_hours?: number;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  max_times_usable?: number;
  usage_period?: string;
  min_employment_months?: number;
  gender_restriction?: string;
  max_days_per_occurrence?: number;
  requires_documentation?: boolean;
  eligibility_criteria?: string;
};

export type SalaryComponentType = {
  component_type_id: number;
  name: string;
  description?: string;
  is_taxable?: boolean;
  is_basic_salary?: boolean;
  display_order?: number;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  main_account_code?: string;
  dimension_1?: string;
  dimension_2?: string;
  dimension_3?: string;
  dimension_4?: string;
  dimension_5?: string;
};

export type Party = {
  party_id: number;
  credit_rating?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

export type Department = {
  department_id: number;
  department_name: string;
  parent_department_id?: number;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  department?: Department;
};

export type Employee = {
  party_id: number;
  gender?: string;
  birth_date?: string;
  marital_status?: string;
  name_english: string;
  name_arabic?: string;
  nationality?: string;
  mobile_number: string;
  email?: string;
  emergency_contact_number?: string;
  religion?: string;
  blood_group?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  manager_party_id?: number;
  party?: Party;
  manager?: Employee;
};

export type TerminationReason = {
  term_reason_id: number;
  description: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

export type PositionType = {
  position_type_id: number;
  description?: string;
  title?: string;
  benefit_percent?: number;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

export type LeaveRequest = {
  leave_request_id: number;
  employee_party_id: number;
  leave_type_id: number;
  request_date: string;
  start_date: string;
  end_date: string;
  hours_requested: number;
  status: string;
  reason?: string;
  approved_by_party_id?: number;
  approval_date?: string;
  approval_comments?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  employee?: Employee;
  leave_type?: LeaveType;
};

export type LeaveBalance = {
  employee_party_id: number;
  leave_type_id: number;
  balance_date: string;
  hours_available: number;
  hours_pending: number;
  hours_used_ytd: number;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  employee?: Employee;
  leave_type?: LeaveType;
};

export type LeaveTransaction = {
  leave_transaction_id: number;
  employee_party_id: number;
  leave_type_id: number;
  leave_request_id?: number;
  transaction_date: string;
  hours_used: number;
  transaction_type: string;
  description?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  employee?: Employee;
  leave_type?: LeaveType;
  leave_request?: LeaveRequest;
};

export type Organization = {
  party_id: number;
  name?: string;
  federal_tax_id_num?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  party?: Party;
};

export type UnemploymentClaim = {
  unemployment_claim_id: number;
  from_party_role_id?: number;
  to_party_role_id?: number;
  employment_from_date?: string;
  unemployment_claim_date?: string;
  description?: string;
  status?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

export type Position = {
  position_id: number;
  department_id?: number;
  position_type_id?: number;
  estimated_from_date?: string;
  estimated_thru_date?: string;
  salary_flag?: boolean;
  exempt_flag?: boolean;
  fulltime_flag?: boolean;
  temporary_flag?: boolean;
  actual_from_date?: string;
  actual_thru_date?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  department?: Department;
  position_type?: PositionType;
};

export type PartyRole = {
  party_role_id: number;
  party_id: number;
  role_type?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  party?: Party;
};

export type PositionFulfillment = {
  position_id: number;
  employee_party_id: number;
  from_date: string;
  thru_date?: string;
  comment?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  position?: Position;
  employee?: Employee;
};

export type EmploymentApplication = {
  application_id: number;
  applicant_party_id: number;
  position_id?: number;
  application_date?: string;
  status?: string;
  source?: string;
  referred_by_party_id?: number;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  applicant?: Party;
  position?: Position;
  referred_by?: Party;
};

export type PartyRelationship = {
  from_party_role_id: number;
  to_party_role_id: number;
  from_date: string;
  thru_date?: string;
  comment?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  from_party_role?: PartyRole;
  to_party_role?: PartyRole;
};

export type PerformanceReview = {
  perf_review_id: number;
  receiver_party_role_id: number;
  manager_party_role_id: number;
  from_date?: string;
  thru_date?: string;
  comments?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  receiver_party_role?: PartyRole;
  manager_party_role?: PartyRole;
};

export type Compensation = {
  compensation_id: number;
  employee_party_id: number;
  position_id?: number;
  compensation_type: string;
  amount: number;
  currency?: string;
  pay_frequency?: string;
  from_date: string;
  thru_date?: string;
  reason?: string;
  comment?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  total_amount?: number;
  is_active?: boolean;
  employee?: Employee;
  position?: Position;
};

export type ResponsibilityType = {
  responsibility_type_id: number;
  description?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

export type CompensationComponent = {
  compensation_component_id: number;
  compensation_id: number;
  component_type_id: number;
  amount: number;
  percentage_of_basic?: number;
  is_fixed?: boolean;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  main_account_code?: string;
  dimension_1?: string;
  dimension_2?: string;
  dimension_3?: string;
  dimension_4?: string;
  dimension_5?: string;
  compensation?: Compensation;
  salary_component_type?: SalaryComponentType;
};

export type TerminationType = {
  termination_type_id: number;
  description: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

export type PositionResponsibility = {
  position_id: number;
  responsibility_type_id: number;
  from_date: string;
  thru_date?: string;
  comment?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  position?: Position;
  responsibility_type?: ResponsibilityType;
};

export type PositionReportingStructure = {
  position_id_reports_to: number;
  position_id_reporting: number;
  from_date: string;
  thru_date?: string;
  primary_flag?: boolean;
  comment?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  reports_to_position?: Position;
  reporting_position?: Position;
};

export type SkillType = {
  skill_type_id: number;
  description?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

export type PartySkill = {
  party_id: number;
  skill_type_id: number;
  started_using_date?: string;
  years_experience?: number;
  skill_level?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  party?: Party;
  skill_type?: SkillType;
};

