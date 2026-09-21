import { Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  label: string;
  value?: string;
  "data-testid"?: string;
}

export function StatCard({
  label,
  value,
  "data-testid": dataTestId,
}: StatCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography color="text.secondary" variant="body2">
          {label}
        </Typography>
        <Typography
          data-testid={dataTestId}
          sx={{ mt: 0.5, fontWeight: 700 }}
          variant="h5"
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}