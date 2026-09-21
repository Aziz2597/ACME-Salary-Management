import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { Employee, EmployeePayload, MetaOptions } from "../types";
interface EmployeeDialogProps {
  open: boolean;
  employee: Employee | null;
  options: MetaOptions;
  onClose: () => void;
  onSubmit: (
    payload: EmployeePayload | Partial<EmployeePayload>,
  ) => Promise<void>;
}
const blankForm: EmployeePayload = {
  employee_code: "",
  first_name: "",
  last_name: "",
  email: "",
  country: "",
  department: "",
  job_title: "",
  salary_amount: "",
  currency: "USD",
};
export function EmployeeDialog({
  open,
  employee,
  options,
  onClose,
  onSubmit,
}: EmployeeDialogProps) {
  const [form, setForm] = useState<EmployeePayload>(blankForm);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(employee);
  useEffect(() => {
    setForm(
      employee
        ? {
            employee_code: employee.employee_code,
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            country: employee.country,
            department: employee.department,
            job_title: employee.job_title,
            salary_amount: employee.salary_amount,
            currency: employee.currency,
          }
        : blankForm,
    );
  }, [employee, open]);
  const set = (key: keyof EmployeePayload, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const save = async () => {
    setSaving(true);
    try {
      if (isEdit)
        await onSubmit({
          salary_amount: form.salary_amount,
          currency: form.currency,
        });
      else await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{isEdit ? "Update salary" : "Add employee"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {!isEdit && (
            <TextField
              label="Employee code"
              value={form.employee_code}
              onChange={(e) =>
                set("employee_code", e.target.value.toUpperCase())
              }
              placeholder="E10001"
              required
              helperText="Format: E followed by 5 digits"
            />
          )}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="First name"
              value={form.first_name}
              onChange={(e) => set("first_name", e.target.value)}
              required
              fullWidth
              disabled={isEdit}
            />
            <TextField
              label="Last name"
              value={form.last_name}
              onChange={(e) => set("last_name", e.target.value)}
              required
              fullWidth
              disabled={isEdit}
            />
          </Stack>
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
            disabled={isEdit}
          />
          <TextField
            select
            label="Country"
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            required
            disabled={isEdit}
          >
            {options.countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Department"
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
              required
              fullWidth
              disabled={isEdit}
            >
              {options.departments.map((department) => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Job title"
              value={form.job_title}
              onChange={(e) => set("job_title", e.target.value)}
              required
              fullWidth
              disabled={isEdit}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Annual salary"
              type="number"
              slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
              value={form.salary_amount}
              onChange={(e) => set("salary_amount", e.target.value)}
              required
              fullWidth
            />
            <TextField
              select
              label="Currency"
              value={form.currency}
              onChange={(e) => set("currency", e.target.value)}
              required
              fullWidth
            >
              {["USD", "INR", "EUR", "GBP", "CAD", "AUD", "SGD"].map(
                (currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ),
              )}
            </TextField>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={save}
          variant="contained"
          disabled={saving || !form.salary_amount}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
