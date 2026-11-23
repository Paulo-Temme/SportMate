// Route "/erstellen": Assistent für ein neues Treffen; Gäste werden zur Anmeldung geleitet (F-17, F-02).
import type { Metadata } from 'next';
import { PageFrame } from '@/components/app/page-frame';
import { CreateWizard } from '@/components/create-event/create-wizard';

export const metadata: Metadata = { title: 'Treffen erstellen' };

export default function CreatePage() {
  return (
    <PageFrame>
      <CreateWizard />
    </PageFrame>
  );
}
