"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
} from 'chart.js';
import {
  Bar,
  Line,
  Pie,
  Doughnut,
} from 'react-chartjs-2';
import type { ChartProps, ChartDataPoint } from '@/lib/types';
import { cn } from '@/lib/utils';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ==================== CONFIGURACIONES BASE ====================

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
    },
  },
};

const chartColors = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
  gradient: [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#06b6d4',
  ],
};

// ==================== COMPONENTE PRINCIPAL ====================

export const Chart: React.FC<ChartProps> = ({
  data,
  title,
  type = 'bar',
  height = 300,
  width,
  showLegend = true,
  showTooltip = true,
  color,
  className,
}) => {
  const chartData = React.useMemo(() => {
    const labels = data.map(item => item.label);
    const values = data.map(item => item.value);
    
    let backgroundColor: string | string[];
    let borderColor: string | string[];
    
    if (color) {
      backgroundColor = Array.isArray(color) ? color : color;
      borderColor = Array.isArray(color) ? color : color;
    } else {
      backgroundColor = type === 'pie' || type === 'doughnut' 
        ? chartColors.gradient.slice(0, data.length)
        : chartColors.primary;
      borderColor = backgroundColor;
    }
    
    return {
      labels,
      datasets: [
        {
          label: title || 'Datos',
          data: values,
          backgroundColor: Array.isArray(backgroundColor) 
            ? backgroundColor 
            : type === 'line' 
              ? `${backgroundColor}20` 
              : backgroundColor,
          borderColor: borderColor,
          borderWidth: type === 'line' ? 3 : 1,
          fill: type === 'line',
          tension: type === 'line' ? 0.4 : 0,
          pointBackgroundColor: type === 'line' ? borderColor : undefined,
          pointBorderColor: type === 'line' ? '#fff' : undefined,
          pointBorderWidth: type === 'line' ? 2 : undefined,
          pointRadius: type === 'line' ? 5 : undefined,
        },
      ],
    };
  }, [data, title, type, color]);

  const options = React.useMemo(() => ({
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      legend: {
        ...baseOptions.plugins.legend,
        display: showLegend,
      },
      tooltip: {
        ...baseOptions.plugins.tooltip,
        enabled: showTooltip,
      },
    },
    scales: type === 'pie' || type === 'doughnut' ? undefined : {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
    },
  }), [showLegend, showTooltip, type]);

  const containerStyle = {
    height: height,
    width: width || '100%',
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;
      case 'bar':
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <div style={containerStyle}>
        {renderChart()}
      </div>
    </div>
  );
};

// ==================== COMPONENTES ESPECIALIZADOS ====================

export const ProgressChart: React.FC<{
  data: ChartDataPoint[];
  title?: string;
  className?: string;
}> = ({ data, title, className }) => {
  return (
    <Chart
      data={data}
      title={title}
      type="line"
      height={250}
      color={chartColors.primary}
      className={className}
    />
  );
};

export const SubjectBreakdownChart: React.FC<{
  data: ChartDataPoint[];
  title?: string;
  className?: string;
}> = ({ data, title, className }) => {
  return (
    <Chart
      data={data}
      title={title}
      type="doughnut"
      height={300}
      color={chartColors.gradient}
      className={className}
    />
  );
};

export const ActivityChart: React.FC<{
  data: ChartDataPoint[];
  title?: string;
  className?: string;
  period?: 'week' | 'month';
}> = ({ data, title, className }) => {
  return (
    <Chart
      data={data}
      title={title}
      type="bar"
      height={280}
      color={chartColors.success}
      className={className}
    />
  );
};

export const ComparisonChart: React.FC<{
  datasets: Array<{
    label: string;
    data: ChartDataPoint[];
    color: string;
  }>;
  title?: string;
  className?: string;
}> = ({ datasets, title, className }) => {
  const chartData = {
    labels: datasets[0]?.data.map(item => item.label) || [],
    datasets: datasets.map(dataset => ({
      label: dataset.label,
      data: dataset.data.map(item => item.value),
      backgroundColor: `${dataset.color}20`,
      borderColor: dataset.color,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    })),
  };

  const options = {
    ...baseOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
    },
  };

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <div style={{ height: 300 }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

// ==================== COMPONENTE DE HEATMAP ====================

export const ActivityHeatmap: React.FC<{
  data: Array<{
    date: string;
    value: number;
    sessions?: number;
  }>;
  title?: string;
  className?: string;
}> = ({ data, title, className }) => {
  const getIntensityClass = (value: number) => {
    if (value === 0) return 'bg-slate-100 dark:bg-slate-800';
    if (value <= 1) return 'bg-green-200 dark:bg-green-900';
    if (value <= 2) return 'bg-green-300 dark:bg-green-800';
    if (value <= 3) return 'bg-green-400 dark:bg-green-700';
    return 'bg-green-500 dark:bg-green-600';
  };

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-7 gap-1 max-w-sm">
        {data.map((day, index) => (
          <div
            key={index}
            className={cn(
              "w-3 h-3 rounded-sm",
              getIntensityClass(day.value)
            )}
            title={`${day.date}: ${day.sessions || 0} sesiones`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
        <span>Menos</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-slate-100 dark:bg-slate-800 rounded-sm" />
          <div className="w-3 h-3 bg-green-200 dark:bg-green-900 rounded-sm" />
          <div className="w-3 h-3 bg-green-300 dark:bg-green-800 rounded-sm" />
          <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded-sm" />
          <div className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded-sm" />
        </div>
        <span>Más</span>
      </div>
    </div>
  );
};

// ==================== COMPONENTE DE SPARKLINE ====================

export const Sparkline: React.FC<{
  data: number[];
  color?: string;
  height?: number;
  className?: string;
}> = ({ data, color = chartColors.primary, height = 40, className }) => {
  const sparklineData = {
    labels: data.map((_, i) => i),
    datasets: [
      {
        data,
        borderColor: color,
        backgroundColor: `${color}10`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const sparklineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
    },
  };

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <Line data={sparklineData} options={sparklineOptions} />
    </div>
  );
};

export default Chart;