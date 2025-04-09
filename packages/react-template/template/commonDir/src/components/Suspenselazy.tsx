import React, { Suspense, lazy } from 'react';
import * as Sentry from '@sentry/react';

const Suspenselazy = (props: any) => {
  return (
    <Suspense fallback={<>...</>}>
      <Sentry.ErrorBoundary>
        {React.createElement(lazy(props))}
      </Sentry.ErrorBoundary>
    </Suspense>
  );
};

export default Suspenselazy;
