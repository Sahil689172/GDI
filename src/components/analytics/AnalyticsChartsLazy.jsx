import React, { lazy, Suspense, memo } from 'react';
import { RouteLoader } from '../../ui/RouteLoader';

const ProductivityChart = lazy(() =>
  import('./ProductivityChart').then((m) => ({ default: m.ProductivityChart }))
);
const CompletionChart = lazy(() =>
  import('./CompletionChart').then((m) => ({ default: m.CompletionChart }))
);
const FocusTrendChart = lazy(() =>
  import('./FocusTrendChart').then((m) => ({ default: m.FocusTrendChart }))
);

const ChartFallback = memo(function ChartFallback() {
  return (
    <div className="chart-responsive w-full min-w-0 flex items-center justify-center rounded-xl border border-border bg-surface/50">
      <RouteLoader label="Loading chart..." />
    </div>
  );
});

export const ProductivityChartLazy = memo(({ data }) => (
  <Suspense fallback={<ChartFallback />}>
    <ProductivityChart data={data} />
  </Suspense>
));

export const CompletionChartLazy = memo(({ data }) => (
  <Suspense fallback={<ChartFallback />}>
    <CompletionChart data={data} />
  </Suspense>
));

export const FocusTrendChartLazy = memo(({ data }) => (
  <Suspense fallback={<ChartFallback />}>
    <FocusTrendChart data={data} />
  </Suspense>
));
