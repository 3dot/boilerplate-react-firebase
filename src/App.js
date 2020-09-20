import React from 'react';

import Base from './Base';

const FirebaseServiceProvider = React.lazy(() => import('./services/Firebase'));

const Fallback = () => (
  <pre>Loading...</pre>
);

export default () => (
  <React.Suspense fallback={<Fallback />}>
    <FirebaseServiceProvider fallback={<Fallback />}>
      <Base />
    </FirebaseServiceProvider>
  </React.Suspense>
);