// Route "/profil": angemeldete Person mit Abmelden oder Einstieg für Gäste (F-01).
import type { Metadata } from 'next';
import { PageFrame } from '@/components/app/page-frame';
import { ProfileView } from '@/components/profile/profile-view';

export const metadata: Metadata = { title: 'Profil' };

export default function ProfilePage() {
  return (
    <PageFrame narrow>
      <ProfileView />
    </PageFrame>
  );
}
