/**
 * Sequence plot components
 *
 * Two variants:
 * - PreviewPlot: Minimal visualization for cards/previews
 * - FullPlot: Interactive plot with controls for sequence detail pages
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Sequence } from '../../models/Sequence';

export interface PlotProps {
  sequence: Sequence;
  width?: number | string;
  height?: number | string;
}

/**
 * Preview Plot - Minimal visualization without labels or interactivity
 * Intended for sequence cards and hover previews
 */
export function PreviewPlot({ sequence, width = '100%', height = 120 }: PlotProps) {
  // Prepare data for chart
  const data = sequence.values.map((value, index) => ({
    index,
    value,
  }));

  // Subtle tooltip for preview (just text, no box)
  const PreviewTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            color: 'var(--color-text-tertiary)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            opacity: 0.8,
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
            value: 'Index (n)',
            position: 'insideBottom',
            offset: -10,
            style: { fill: 'var(--color-text-secondary)', fontSize: '0.9rem' },
          }}
          stroke="var(--color-text-tertiary)"
          tick={{ fill: 'var(--color-text-tertiary)', fontSize: '0.85rem' }}
        />
        <YAxis
          label={{
            value: logScale ? 'log₁₀(value)' : 'Value',
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
