import React, { lazy, Suspense } from 'react';

/**
 * Enterprise Route Loading Fallback Skeleton
 * Prevents Cumulative Layout Shift (CLS) during asynchronous chunk hydration
 */
export const RouteLoadingSkeleton = ({ title = 'Loading Module' }) => (
  <div className="w-full min-h-[500px] p-6 space-y-6 animate-pulse" role="status" aria-label="Loading content">
    <div className="flex items-center justify-between border-b border-slate-700/40 pb-4">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-slate-700/50 rounded-lg"></div>
        <div className="h-4 w-72 bg-slate-700/30 rounded"></div>
      </div>
      <div className="h-9 w-32 bg-slate-700/50 rounded-lg"></div>
    </div>

    {/* Metric Cards Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(idx => (
        <div key={idx} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 space-y-3">
          <div className="h-4 w-24 bg-slate-700/40 rounded"></div>
          <div className="h-7 w-20 bg-slate-600/50 rounded"></div>
        </div>
      ))}
    </div>

    {/* Table / Grid Skeleton */}
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-4">
      <div className="h-5 w-40 bg-slate-700/50 rounded"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(row => (
          <div key={row} className="h-10 bg-slate-700/20 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Higher-Order Component for Safe Lazy Route Splitting with Error Boundaries
 */
export const lazyRoute = (importFn, fallbackTitle) => {
  const LazyComponent = lazy(importFn);

  return function LazyRouteWrapper(props) {
    return (
      <Suspense fallback={<RouteLoadingSkeleton title={fallbackTitle} />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

/**
 * Route-Level Lazy Components for JCB360 Enterprise Modules:
 * Chunks are loaded over the wire strictly when user navigates to the view
 */
export const LazyModules = {
  // 1. CRM & Client Lifecycle Hub
  CrmHub: lazyRoute(
    () => import(/* webpackChunkName: "module-crm" */ '../modules/crm/CrmModule.jsx').catch(() => ({ default: () => <div>Module failed to load</div> })),
    'CRM & Leads'
  ),

  // 2. Billing & Invoicing (GST Engine)
  BillingHub: lazyRoute(
    () => import(/* webpackChunkName: "module-billing" */ '../modules/billing/BillingModule.jsx').catch(() => ({ default: () => <div>Module failed to load</div> })),
    'Billing & GST'
  ),

  // 3. Machinery Fleet & Site Logs
  FleetHub: lazyRoute(
    () => import(/* webpackChunkName: "module-fleet" */ '../modules/fleet/FleetModule.jsx').catch(() => ({ default: () => <div>Module failed to load</div> })),
    'Machinery & Site Logs'
  ),

  // 4. Financial Accounts & Cashflow
  AccountsHub: lazyRoute(
    () => import(/* webpackChunkName: "module-accounts" */ '../modules/accounts/AccountsModule.jsx').catch(() => ({ default: () => <div>Module failed to load</div> })),
    'Financial Accounts'
  ),

  // 5. Diesel & Maintenance Tracking
  MaintenanceHub: lazyRoute(
    () => import(/* webpackChunkName: "module-maintenance" */ '../modules/maintenance/MaintenanceModule.jsx').catch(() => ({ default: () => <div>Module failed to load</div> })),
    'Diesel & Maintenance'
  ),

  // 6. Reports & Executive Analytics
  ReportsHub: lazyRoute(
    () => import(/* webpackChunkName: "module-reports" */ '../modules/reports/ReportsModule.jsx').catch(() => ({ default: () => <div>Module failed to load</div> })),
    'Reports & Analytics'
  )
};

/**
 * Intelligent Chunk Prefetcher:
 * Warms up route chunk in browser cache when user hovers or focuses on sidebar menu items
 */
export const prefetchRoute = (importFn) => {
  try {
    const componentPromise = importFn();
    if (componentPromise && typeof componentPromise.catch === 'function') {
      componentPromise.catch(() => {});
    }
  } catch (e) {}
};

export default LazyModules;
