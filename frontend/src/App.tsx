import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  createEmployee,
  fetchAnalytics,
  fetchEmployees,
  fetchMetaOptions,
  updateEmployee,
} from "./api";
import type {
  AnalyticsSummary,
  Employee,
  EmployeePayload,
  EmployeeListResponse,
  MetaOptions,
} from "./types";
import { AnalyticsSection } from "./components/AnalyticsSection";
import { EmployeeDialog } from "./components/EmployeeDialog";
import { EmployeeTable } from "./components/EmployeeTable";
const emptyList: EmployeeListResponse = {
  items: [],
  page: 1,
  page_size: 25,
  total: 0,
};
function App() {
  const [tab, setTab] = useState(0);
  const [options, setOptions] = useState<MetaOptions>({
    countries: [],
    departments: [],
  });
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [employees, setEmployees] = useState<EmployeeListResponse>(emptyList);
  const [analyticsFilters, setAnalyticsFilters] = useState({
    country: "",
    department: "",
  });
  const [employeeFilters, setEmployeeFilters] = useState({
    q: "",
    country: "",
    department: "",
    sortBy: "employee_code",
    sortOrder: "asc",
  });
  const [employeePage, setEmployeePage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const employeeQuery = useMemo(() => {
    const params = new URLSearchParams({
      page: String(employeePage),
      page_size: String(pageSize),
      sort_by: employeeFilters.sortBy,
      sort_order: employeeFilters.sortOrder,
    });
    if (employeeFilters.q.trim()) params.set("q", employeeFilters.q.trim());
    if (employeeFilters.country) params.set("country", employeeFilters.country);
    if (employeeFilters.department)
      params.set("department", employeeFilters.department);
    return params;
  }, [employeeFilters, employeePage, pageSize]);
  const loadOptions = async () => {
    try {
      setOptions(await fetchMetaOptions());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load filter options",
      );
    }
  };
  const loadEmployees = async () => {
    setLoadingEmployees(true);
    try {
      setEmployees(await fetchEmployees(employeeQuery));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load employees");
    } finally {
      setLoadingEmployees(false);
    }
  };
  const loadAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      setAnalytics(
        await fetchAnalytics(
          analyticsFilters.country,
          analyticsFilters.department,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load analytics");
    } finally {
      setLoadingAnalytics(false);
    }
  };
  useEffect(() => {
    void loadOptions();
  }, []);
  useEffect(() => {
    void loadEmployees();
  }, [employeeQuery]);
  useEffect(() => {
    void loadAnalytics();
  }, [analyticsFilters]);
  const openEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };
  const openCreate = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };
  const saveEmployee = async (
    payload: EmployeePayload | Partial<EmployeePayload>,
  ) => {
    try {
      if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, payload);
        setNotice("Salary updated successfully.");
      } else {
        await createEmployee(payload as EmployeePayload);
        setNotice("Employee created successfully.");
      }
      setDialogOpen(false);
      await Promise.all([loadEmployees(), loadAnalytics(), loadOptions()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save employee");
      throw err;
    }
  };
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              ACME Salary Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              HR Manager workspace
            </Typography>
          </Box>
          <Typography color="text.secondary" variant="body2">
            Assessment MVP
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            aria-label="Application sections"
          >
            <Tab label="Dashboard" />
            <Tab label="Employees" />
          </Tabs>
          <Divider />
          {tab === 0 && (
            <AnalyticsSection
              analytics={analytics}
              options={options}
              country={analyticsFilters.country}
              department={analyticsFilters.department}
              loading={loadingAnalytics}
              onCountryChange={(value) =>
                setAnalyticsFilters((current) => ({
                  ...current,
                  country: value,
                }))
              }
              onDepartmentChange={(value) =>
                setAnalyticsFilters((current) => ({
                  ...current,
                  department: value,
                }))
              }
            />
          )}
          {tab === 1 && (
            <Stack spacing={2}>
              <Paper sx={{ p: 2 }}>
                <Stack
                    direction={{ xs: "column", lg: "row" }}
                    spacing={2}
                    sx={{ alignItems: { lg: "center" } }}
                >
                  <TextField
                    label="Search employees"
                    placeholder="Name, email, employee code, role"
                    value={employeeFilters.q}
                    onChange={(event) => {
                      setEmployeePage(1);
                      setEmployeeFilters((current) => ({
                        ...current,
                        q: event.target.value,
                      }));
                    }}
                    fullWidth
                  />
                  <TextField
                    select
                    label="Country"
                    value={employeeFilters.country}
                    onChange={(event) => {
                      setEmployeePage(1);
                      setEmployeeFilters((current) => ({
                        ...current,
                        country: event.target.value,
                      }));
                    }}
                    sx={{ minWidth: 200 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {options.countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Department"
                    value={employeeFilters.department}
                    onChange={(event) => {
                      setEmployeePage(1);
                      setEmployeeFilters((current) => ({
                        ...current,
                        department: event.target.value,
                      }));
                    }}
                    sx={{ minWidth: 200 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {options.departments.map((department) => (
                      <MenuItem key={department} value={department}>
                        {department}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Sort"
                    value={employeeFilters.sortBy}
                    onChange={(event) => {
                      setEmployeePage(1);
                      setEmployeeFilters((current) => ({
                        ...current,
                        sortBy: event.target.value,
                      }));
                    }}
                    sx={{ minWidth: 180 }}
                  >
                    <MenuItem value="employee_code">Employee code</MenuItem>
                    <MenuItem value="first_name">Name</MenuItem>
                    <MenuItem value="country">Country</MenuItem>
                    <MenuItem value="department">Department</MenuItem>
                    <MenuItem value="salary_amount">Local salary</MenuItem>
                  </TextField>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setEmployeeFilters((current) => ({
                        ...current,
                        sortOrder: current.sortOrder === "asc" ? "desc" : "asc",
                      }))
                    }
                  >
                    {employeeFilters.sortOrder === "asc"
                      ? "Ascending"
                      : "Descending"}
                  </Button>
                  <Button variant="contained" onClick={openCreate}>
                    Add employee
                  </Button>
                </Stack>
              </Paper>
              <EmployeeTable
                employees={employees.items}
                total={employees.total}
                page={employees.page}
                pageSize={employees.page_size}
                loading={loadingEmployees}
                onPageChange={setEmployeePage}
                onPageSizeChange={(value) => {
                  setPageSize(value);
                  setEmployeePage(1);
                }}
                onEdit={openEdit}
              />
            </Stack>
          )}
        </Stack>
      </Container>
      <EmployeeDialog
        open={dialogOpen}
        employee={selectedEmployee}
        options={options}
        onClose={() => setDialogOpen(false)}
        onSubmit={saveEmployee}
      />
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3500}
        onClose={() => setNotice(null)}
        message={notice}
      />
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
export default App;
