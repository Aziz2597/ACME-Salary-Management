import type {
  AnalyticsSummary,
  Employee,
  EmployeeListResponse,
  EmployeePayload,
  MetaOptions,
} from "./types";
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api"
).replace(/\/$/, "");
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body.detail) message = body.detail;
    } catch {}
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}
export function fetchEmployees(
  params: URLSearchParams,
): Promise<EmployeeListResponse> {
  const query = params.toString();
  return request<EmployeeListResponse>(`/employees${query ? `?${query}` : ""}`);
}
export function fetchEmployee(id: number): Promise<Employee> {
  return request<Employee>(`/employees/${id}`);
}
export function createEmployee(payload: EmployeePayload): Promise<Employee> {
  return request<Employee>("/employees", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export function updateEmployee(
  id: number,
  payload: Partial<EmployeePayload>,
): Promise<Employee> {
  return request<Employee>(`/employees/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
export function fetchMetaOptions(): Promise<MetaOptions> {
  return request<MetaOptions>("/meta/options");
}
export function fetchAnalytics(
  country?: string,
  department?: string,
): Promise<AnalyticsSummary> {
  const params = new URLSearchParams();
  if (country) params.set("country", country);
  if (department) params.set("department", department);
  const query = params.toString();
  return request<AnalyticsSummary>(
    `/analytics/summary${query ? `?${query}` : ""}`,
  );
}
