'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

interface Props {
  children: ReactNode;
}

export function GlobalErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Could send to error tracking service like Sentry here
        console.error('Global Error:', error);
        console.error('Component Stack:', errorInfo.componentStack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
