'use client';

import { lazy, Suspense } from 'react';
import { LazyLoadFallback } from '@/components/ui/lazy-load';

// Correctly import Dynamic SDK components
const DynamicContextProvider = lazy(() => 
  import('@dynamic-labs/sdk-react-core').then(mod => ({ default: mod.DynamicContextProvider }))
);

// Don't lazy load this - it's not a React component
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

export function DynamicProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LazyLoadFallback />}>
      <DynamicContextProvider
        settings={{
          environmentId: "ac4a784c-06b7-449c-8125-37bd9c40ec4d",
          walletConnectors: [EthereumWalletConnectors], // This is a function, not a component
        }}
      >
        {children}
      </DynamicContextProvider>
    </Suspense>
  );
}