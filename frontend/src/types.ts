export interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  department: string;
  job_title: string;
  salary_amount: string;
  currency: string;
  salary_usd: string;
  created_at: string;
  updated_at: string;
}
export interface EmployeeListResponse {
  items: Employee[];
  page: number;
  page_size: number;
  total: number;
}
export interface MetaOptions {
  countries: string[];
  departments: string[];
}
export interface SalaryBreakdownItem {
  label: string;
  employee_count: number;
  average_salary_usd: string;
}
export interface SalaryBandItem {
  label: string;
  employee_count: number;
}
export interface AnalyticsSummary {
  employee_count: number;
  average_salary_usd: string;
  median_salary_usd: string;
  min_salary_usd: string;
  max_salary_usd: string;
  by_country: SalaryBreakdownItem[];
  by_department: SalaryBreakdownItem[];
  salary_bands: SalaryBandItem[];
  reporting_currency: string;
  reporting_note: string;
}
export interface EmployeePayload {
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  department: string;
  job_title: string;
  salary_amount: string;
  currency: string;
}
