import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import type { Employee } from "../types";
interface EmployeeTableProps {
  employees: Employee[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (employee: Employee) => void;
}
function localCurrency(value: string, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(value));
  } catch {
    return `${value} ${currency}`;
  }
}
function usd(value: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}
export function EmployeeTable({
  employees,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onPageSizeChange,
  onEdit,
}: EmployeeTableProps) {
  return (
    <Paper>
      <TableContainer sx={{ maxHeight: 560 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Local salary</TableCell>
              <TableCell>USD equivalent</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} hover>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>
                    {employee.first_name} {employee.last_name}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {employee.employee_code}
                  </Typography>
                </TableCell>
                <TableCell>{employee.country}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.job_title}</TableCell>
                <TableCell>
                  {localCurrency(employee.salary_amount, employee.currency)}
                </TableCell>
                <TableCell>{usd(employee.salary_usd)}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => onEdit(employee)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  No employees match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
        }}
      >
        {loading ? (
          <Typography color="text.secondary" sx={{ pl: 1 }}>
            Loading…
          </Typography>
        ) : (
          <span />
        )}
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          onPageChange={(_, nextPage) => onPageChange(nextPage + 1)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(event) =>
            onPageSizeChange(Number(event.target.value))
          }
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Box>
    </Paper>
  );
}
