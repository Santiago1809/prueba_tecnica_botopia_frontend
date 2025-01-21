"use client";

import { DatosMensuales } from "@/types/admin";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface Props {
  data: DatosMensuales;
}

export function Overview({ data }: Props) {
  const datos = Object.entries(data).map(([name, total]) => ({
    name,
    total,
  }));
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={datos}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
