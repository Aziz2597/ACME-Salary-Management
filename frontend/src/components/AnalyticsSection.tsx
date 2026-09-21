import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { AnalyticsSummary, MetaOptions } from "../types";
import { StatCard } from "./StatCard";
interface AnalyticsSectionProps {
  analytics: AnalyticsSummary | null;
  options: MetaOptions;
  country: string;
  department: string;
  loading: boolean;
  onCountryChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
}
const usd = (value: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
function Breakdown({
  title,
  items,
}: {
  title: string;
  items: {
    label: string;
    employee_count: number;
    average_salary_usd: string;
  }[];
}) {
  const max = Math.max(
    ...items.map((item) => Number(item.average_salary_usd)),
    1,
  );
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontWeight: 700, mb: 2 }}>
        {title}
      </Typography>
      <Stack spacing={1.5}>
        {items.map((item) => (
          <Box key={item.label}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                mb: 0.5,
              }}
            >
              <Typography variant="body2">{item.label}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {usd(item.average_salary_usd)} · {item.employee_count}
              </Typography>
            </Box>
            <Box
              sx={{
                height: 8,
                bgcolor: "grey.200",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${(Number(item.average_salary_usd) / max) * 100}%`,
                  height: "100%",
                  bgcolor: "primary.main",
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
export function AnalyticsSection({
  analytics,
  options,
  country,
  department,
  loading,
  onCountryChange,
  onDepartmentChange,
}: AnalyticsSectionProps) {
  if (!analytics && loading)
    return <Typography color="text.secondary">Loading analytics…</Typography>;
  if (!analytics) return null;
  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Country</InputLabel>
          <Select
            label="Country"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
          >
            <MenuItem value="">All countries</MenuItem>
            {options.countries.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Department</InputLabel>
          <Select
            label="Department"
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
          >
            <MenuItem value="">All departments</MenuItem>
            {options.departments.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Alert severity="info">{analytics.reporting_note}</Alert>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 2,
        }}
      >
        <StatCard
            label="Employees"
            value={analytics.employee_count.toLocaleString()}
            data-testid="employee-count"
        />
        <StatCard
          label="Average salary"
          value={usd(analytics.average_salary_usd)}
        />
        <StatCard
          label="Median salary"
          value={usd(analytics.median_salary_usd)}
        />
        <StatCard
          label="Minimum salary"
          value={usd(analytics.min_salary_usd)}
        />
        <StatCard
          label="Maximum salary"
          value={usd(analytics.max_salary_usd)}
        />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Breakdown
          title="Average salary by country"
          items={analytics.by_country}
        />
        <Breakdown
          title="Average salary by department"
          items={analytics.by_department}
        />
      </Box>
      <Paper sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          Salary distribution
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Band</TableCell>
              <TableCell align="right">Employees</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analytics.salary_bands.map((band) => (
              <TableRow key={band.label}>
                <TableCell>{band.label}</TableCell>
                <TableCell align="right">
                  {band.employee_count.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
