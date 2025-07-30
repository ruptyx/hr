interface Employment {
  from_party_role_id: number   /* primary key */;
  to_party_role_id: number   /* primary key */;
  from_date: string   /* primary key */;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

interface Leave_type {
  leave_type_id: number   /* primary key */;
  name: string;
  description?: string;
  is_paid?: boolean;
  accrual_rate?: any // type unknown;
  max_accrual_hours?: any // type unknown;
  carryover_allowed?: boolean;
  max_carryover_hours?: any // type unknown;
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

interface Salary_component_type {
  component_type_id: number   /* primary key */;
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

interface Party {
  party_id: number   /* primary key */;
  credit_rating?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

interface Department {
  department_id: number   /* primary key */;
  department_name: string;
  parent_department_id?: number   /* foreign key to department.department_id */;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  department?: Department;
};

interface Employee {
  party_id: number   /* primary key */   /* foreign key to party.party_id */;
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
  manager_party_id?: number   /* foreign key to employee.party_id */;
  party?: Party;
  employee?: Employee;
};

interface Termination_reason {
  term_reason_id: number   /* primary key */;
  description: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

interface Position_type {
  position_type_id: number   /* primary key */;
  description?: string;
  title?: string;
  benefit_percent?: any // type unknown;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

interface Leave_request {
  leave_request_id: number   /* primary key */;
  employee_party_id: number   /* foreign key to employee.party_id */;
  leave_type_id: number   /* foreign key to leave_type.leave_type_id */;
  request_date: string;
  start_date: string;
  end_date: string;
  hours_requested: any // type unknown;
  status: string;
  reason?: string;
  approved_by_party_id?: number   /* foreign key to employee.party_id */;
  approval_date?: string;
  approval_comments?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  employee?: Employee;
  leave_type?: Leave_type;
  employee?: Employee;
};

interface Leave_balance {
  employee_party_id: number   /* primary key */   /* foreign key to employee.party_id */;
  leave_type_id: number   /* primary key */   /* foreign key to leave_type.leave_type_id */;
  balance_date: string   /* primary key */;
  hours_available: any // type unknown;
  hours_pending: any // type unknown;
  hours_used_ytd: any // type unknown;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  employee?: Employee;
  leave_type?: Leave_type;
};

interface Leave_transaction {
  leave_transaction_id: number   /* primary key */;
  employee_party_id: number   /* foreign key to employee.party_id */;
  leave_type_id: number   /* foreign key to leave_type.leave_type_id */;
  leave_request_id?: number   /* foreign key to leave_request.leave_request_id */;
  transaction_date: string;
  hours_used: any // type unknown;
  transaction_type: string;
  description?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  employee?: Employee;
  leave_type?: Leave_type;
  leave_request?: Leave_request;
};

interface Organization {
  party_id: number   /* primary key */   /* foreign key to party.party_id */;
  name?: string;
  federal_tax_id_num?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  party?: Party;
};

interface Unemployment_claim {
  unemployment_claim_id: number   /* primary key */;
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

interface Position {
  position_id: number   /* primary key */;
  department_id?: number   /* foreign key to department.department_id */;
  position_type_id?: number   /* foreign key to position_type.position_type_id */;
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
  position_type?: Position_type;
};

interface Party_role {
  party_role_id: number   /* primary key */;
  party_id: number   /* foreign key to party.party_id */;
  role_type?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  party?: Party;
};

interface Position_fulfillment {
  position_id: number   /* primary key */   /* foreign key to position.position_id */;
  employee_party_id: number   /* primary key */   /* foreign key to employee.party_id */;
  from_date: string   /* primary key */;
  thru_date?: string;
  comment?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  position?: Position;
  employee?: Employee;
};

interface Employment_application {
  application_id: number   /* primary key */;
  applicant_party_id: number   /* foreign key to party.party_id */;
  position_id?: number   /* foreign key to position.position_id */;
  application_date?: string;
  status?: string;
  source?: string;
  referred_by_party_id?: number   /* foreign key to party.party_id */;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  party?: Party;
  position?: Position;
  party?: Party;
};

interface Party_relationship {
  from_party_role_id: number   /* primary key */   /* foreign key to party_role.party_role_id */;
  to_party_role_id: number   /* primary key */   /* foreign key to party_role.party_role_id */;
  from_date: string   /* primary key */;
  thru_date?: string;
  comment?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  party_role?: Party_role;
  party_role?: Party_role;
};

interface Performance_review {
  perf_review_id: number   /* primary key */;
  receiver_party_role_id: number   /* foreign key to party_role.party_role_id */;
  manager_party_role_id: number   /* foreign key to party_role.party_role_id */;
  from_date?: string;
  thru_date?: string;
  comments?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  party_role?: Party_role;
  party_role?: Party_role;
};

interface Compensation {
  compensation_id: number   /* primary key */;
  employee_party_id: number   /* foreign key to employee.party_id */;
  position_id?: number   /* foreign key to position.position_id */;
  compensation_type: string;
  amount: any // type unknown;
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
  total_amount?: any // type unknown;
  is_active?: boolean;
  employee?: Employee;
  position?: Position;
};

interface Responsibility_type {
  responsibility_type_id: number   /* primary key */;
  description?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

interface Compensation_component {
  compensation_component_id: number   /* primary key */;
  compensation_id: number   /* foreign key to compensation.compensation_id */;
  component_type_id: number   /* foreign key to salary_component_type.component_type_id */;
  amount: any // type unknown;
  percentage_of_basic?: any // type unknown;
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
  salary_component_type?: Salary_component_type;
};

interface Termination_type {
  termination_type_id: number   /* primary key */;
  description: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

interface Position_responsibility {
  position_id: number   /* primary key */   /* foreign key to position.position_id */;
  responsibility_type_id: number   /* primary key */   /* foreign key to responsibility_type.responsibility_type_id */;
  from_date: string   /* primary key */;
  thru_date?: string;
  comment?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  position?: Position;
  responsibility_type?: Responsibility_type;
};

interface Position_reporting_structure {
  position_id_reports_to: number   /* primary key */   /* foreign key to position.position_id */;
  position_id_reporting: number   /* primary key */   /* foreign key to position.position_id */;
  from_date: string   /* primary key */;
  thru_date?: string;
  primary_flag?: boolean;
  comment?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  position?: Position;
  position?: Position;
};

interface Skill_type {
  skill_type_id: number   /* primary key */;
  description?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
};

interface Party_skill {
  party_id: number   /* primary key */   /* foreign key to party.party_id */;
  skill_type_id: number   /* primary key */   /* foreign key to skill_type.skill_type_id */;
  started_using_date?: string;
  years_experience?: number;
  skill_level?: string;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  modified_by?: string;
  party?: Party;
  skill_type?: Skill_type;
};

