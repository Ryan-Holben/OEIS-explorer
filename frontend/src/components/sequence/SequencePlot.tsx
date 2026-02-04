/**
 * Sequence plot components
 *
 * Two variants:
 * - PreviewPlot: Minimal visualization for cards/previews
 * - FullPlot: Interactive plot with controls for sequence detail pages
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { Sequence } from '../../models/Sequence';

export interface PlotProps {
  sequence: Sequence;
  width?: number | `${number}%`;
  height?: number;
  showZeroAxis?: boolean;
  showYAxis?: boolean;
}

/**
 * Preview Plot - Minimal visualization without labels or interactivity
 * Intended for sequence cards and hover previews
 */
export function PreviewPlot({ sequence, width = '100%', height = 120, showZeroAxis = false, showYAxis = true }: PlotProps) {
  // Prepare data for chart
  const data = sequence.values.map((value, index) => ({
    index,
    value,
  }));

  // Calculate min and max for y-axis ticks
  const minValue = sequence.metadata.minValue;
  const maxValue = sequence.metadata.maxValue;

  // Create y-axis ticks array, excluding 0
  const yAxisTicks: number[] = [];
  if (minValue !== 0) yAxisTicks.push(minValue);
  if (maxValue !== 0 && maxValue !== minValue) yAxisTicks.push(maxValue);

  // Custom tick component that adjusts position of bottom label
  const CustomTick = ({ x, y, payload }: any) => {
    // If this is the lowest tick value (bottom of chart), move it up to prevent cutoff
    const isLowestTick = yAxisTicks.length > 0 && payload.value === yAxisTicks[0];
    const adjustedY = isLowestTick ? y - 8 : y;

    return (
      <text
        x={x + 10}
        y={adjustedY}
        fill="var(--color-text-tertiary)"
        fontSize="0.75rem"
        fontFamily="var(--font-mono)"
        textAnchor="start"
        dominantBaseline="middle"
      >
        {payload.value}
      </text>
    );
  };

  // Subtle tooltip for preview with semi-transparent background
  const PreviewTooltip = ({ active, payload, coordinate }: any) => {
    if (active && payload && payload.length && coordinate) {
      const data = payload[0].payload;
      // Position tooltip above the point by default, below if near top
      const isNearTop = coordinate.y < 40;
      return (
        <div
          style={{
            backgroundColor: 'var(--color-panel-bg)',
            opacity: 0.8,
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-xs) var(--space-sm)',
            color: 'var(--color-text-primary)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            transform: isNearTop ? 'translateY(20px)' : 'translateY(-25px)',
          }}
        >
          ({data.index}, {data.value})
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        {showZeroAxis && (
          <ReferenceLine
            y={0}
            stroke="var(--color-text-tertiary)"
            strokeWidth={1}
            opacity={0.5}
          />
        )}
        {showYAxis && (
          <YAxis
            domain={[minValue, maxValue]}
            ticks={yAxisTicks}
            orientation="left"
            axisLine={{ stroke: 'var(--color-text-tertiary)', strokeWidth: 1 }}
            tickLine={false}
            tick={<CustomTick />}
            width={30}
          />
        )}
        <Tooltip content={<PreviewTooltip />} animationDuration={0} cursor={false} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-accent-primary)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export interface FullPlotProps extends PlotProps {
  /** Whether to use logarithmic scale */
  logScale?: boolean;
  /** Whether to show grid */
  showGrid?: boolean;
  /** Whether to show tooltip */
  showTooltip?: boolean;
}

/**
 * Full Plot - Interactive visualization for sequence detail pages
 * Includes axes, grid, tooltips, and controls
 */
export function FullPlot({
  sequence,
  width = '100%',
  height = 400,
  logScale = false,
  showGrid = true,
  showTooltip = true,
}: FullPlotProps) {
  const metadata = sequence.metadata;

  // Prepare data for chart
  const data = sequence.values.map((value, index) => ({
    index,
    value: logScale && value > 0 ? Math.log10(value) : value,
    originalValue: value,
  }));

  // Custom tooltip with simple format: (n, a(n))
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: 'var(--color-panel-bg)',
            border: '1px solid var(--color-panel-border)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-xs) var(--space-sm)',
            fontSize: '0.9rem',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          ({data.index}, {data.originalValue})
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 50, bottom: 30 }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            opacity={0.3}
          />
        )}
        <XAxis
          dataKey="index"
          label={{
            value: 'n',
            position: 'insideBottom',
            offset: -10,
            style: { fill: 'var(--color-text-secondary)', fontSize: '0.9rem' },
          }}
          stroke="var(--color-text-tertiary)"
          tick={{ fill: 'var(--color-text-tertiary)', fontSize: '0.85rem' }}
        />
        <YAxis
          label={{
            value: logScale ? 'log₁₀(a(n))' : 'a(n)',
            angle: -90,
            position: 'insideLeft',
            style: { fill: 'var(--color-text-secondary)', fontSize: '0.9rem' },
          }}
          domain={logScale ? ['auto', 'auto'] : [metadata.minValue, metadata.maxValue]}
          stroke="var(--color-text-tertiary)"
          tick={{ fill: 'var(--color-text-tertiary)', fontSize: '0.85rem' }}
        />
        {showTooltip && <Tooltip content={<CustomTooltip />} animationDuration={0} />}
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-accent-primary)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-accent-primary)', r: 3 }}
          activeDot={{ r: 5, fill: 'var(--color-accent-primary-hover)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
