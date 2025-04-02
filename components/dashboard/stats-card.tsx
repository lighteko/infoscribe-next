import { Card } from "@/components/ui/card";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtext: string;
}

export function StatsCard({ icon, title, value, subtext }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </div>
    </Card>
  );
}