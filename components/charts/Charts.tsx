"use client";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Filler);

const FAINT = "#9A9AA0";
const GRID = "#EDEDF0";

export function NetWorthChart({ labels, data, fmt }: { labels: string[]; data: number[]; fmt: (v: number) => string }) {
  return (
    <Line
      height={170}
      data={{
        labels,
        datasets: [{
          data,
          fill: true,
          borderColor: "#000000",
          borderWidth: 2,
          tension: 0.36,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#000000",
          backgroundColor: (ctx: any) => {
            const { chart } = ctx;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return "rgba(0,0,0,0.08)";
            const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            g.addColorStop(0, "rgba(0,0,0,.10)");
            g.addColorStop(1, "rgba(0,0,0,0)");
            return g;
          },
        }],
      }}
      options={{
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => fmt(c.parsed.y ?? 0) } } },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 6, color: FAINT, font: { size: 10 } } },
          y: { grid: { color: GRID }, ticks: { callback: (v) => fmt(Number(v)), color: FAINT, font: { size: 10 }, maxTicksLimit: 5 } },
        },
      }}
    />
  );
}

export function AllocDonut({ labels, values, colors, pctOf }: { labels: string[]; values: number[]; colors: string[]; pctOf: (v: number) => string }) {
  return (
    <Doughnut
      data={{ labels, datasets: [{ data: values, backgroundColor: colors, borderWidth: 2, borderColor: "#FFFFFF" }] }}
      options={{
        cutout: "66%",
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` ${c.label}: ${pctOf(c.parsed)}` } } },
      }}
    />
  );
}

export function IncomeBar({ labels, data, fmt }: { labels: string[]; data: number[]; fmt: (v: number) => string }) {
  return (
    <Bar
      height={160}
      data={{ labels, datasets: [{ data, backgroundColor: "#8E8E93", borderRadius: 5, maxBarThickness: 24 }] }}
      options={{
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => fmt(c.parsed.y ?? 0) } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: FAINT, font: { size: 10 } } },
          y: { grid: { color: GRID }, ticks: { callback: (v) => fmt(Number(v)), color: FAINT, font: { size: 10 }, maxTicksLimit: 4 } },
        },
      }}
    />
  );
}
