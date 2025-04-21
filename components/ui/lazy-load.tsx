"use client"

import { Suspense, lazy, ComponentType, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface LazyLoadProps {
  children: ReactNode
}

export function LazyLoadFallback() {
  return (
    <div className="flex justify-center items-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export function LazyLoad({ children }: LazyLoadProps) {
  return (
    <Suspense fallback={<LazyLoadFallback />}>
      {children}
    </Suspense>
  )
}

export function lazyImport<T extends ComponentType<any>, I extends { [K in N]: T }, N extends string>(
  factory: () => Promise<I>,
  name: N
): I {
  return Object.create({
    [name]: lazy(() => factory().then((module) => ({ default: module[name] })))
  })
}