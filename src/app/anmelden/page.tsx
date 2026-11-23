// Route "/anmelden": Anmelden, Registrieren und im Demo-Modus Demo-Personen (F-01, F-02, F-32).
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageFrame } from '@/components/app/page-frame';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = { title: 'Anmelden' };

export default function SignInPage() {
  return (
    <PageFrame>
      <Suspense fallback={null}>
        <AuthForm />
      </Suspense>
    </PageFrame>
  );
}
