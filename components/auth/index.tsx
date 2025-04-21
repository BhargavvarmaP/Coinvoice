import dynamic from 'next/dynamic'
import { LazyLoadFallback } from '@/components/ui/lazy-load'

// Lazy load auth components
export const LoginModal = dynamic(
  () => import('./login-modal').then((mod) => ({ default: mod.LoginModal })),
  { loading: () => <LazyLoadFallback /> }
)

export const SignupModal = dynamic(
  () => import('./signup-modal').then((mod) => ({ default: mod.SignupModal })),
  { loading: () => <LazyLoadFallback /> }
)

export const ForgotPasswordModal = dynamic(
  () => import('./forgot-password-modal').then((mod) => ({ default: mod.ForgotPasswordModal })),
  { loading: () => <LazyLoadFallback /> }
)