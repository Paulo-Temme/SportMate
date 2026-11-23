'use client';
// Erstellen-Assistent in drei Schritten mit Fortschritt, Prüfung je Schritt und Erfolgsanimation; Gäste gehen zur Anmeldung (F-17, F-02).
import { ArrowLeft, Check } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useAppServices } from '@/components/app/app-services';
import { useToast } from '@/components/app/toast-provider';
import { EventError } from '@/lib/events/event-error';
import { buildEventInput, createEmptyDraft, findStepErrors, stepOfField, toDraftErrors, type DraftErrors, type EventDraft, type WizardStep } from './event-draft';
import { StepBasics } from './step-basics';
import { StepDetails } from './step-details';
import { StepPlaceTime } from './step-place-time';
import styles from './create-wizard.module.css';

const stepTitles: Record<WizardStep, string> = { 1: 'Was wird gespielt?', 2: 'Wo und wann?', 3: 'Details' };

function Progress({ step }: { step: WizardStep }) {
  return (
    <div className={styles.progress}>
      <p className={styles.progressLabel}>
        Schritt <span className="tabular">{step}</span> von 3
      </p>
      <div className={styles.progressTrack} role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} aria-label="Fortschritt">
        {[1, 2, 3].map((segment) => (
          <span key={segment} className={styles.progressSegment} data-done={segment <= step} />
        ))}
      </div>
    </div>
  );
}

function SuccessOverlay() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div className={styles.success} initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status">
      <motion.span
        className={styles.successBadge}
        initial={reduceMotion ? false : { scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 18 }}
      >
        <Check size={36} strokeWidth={2.5} aria-hidden="true" />
      </motion.span>
      <p className={styles.successText}>Treffen veröffentlicht</p>
    </motion.div>
  );
}

function useGuestRedirect() {
  const { user, authReady } = useAppServices();
  const router = useRouter();
  useEffect(() => {
    if (authReady && !user) router.replace('/anmelden?weiter=%2Ferstellen');
  }, [authReady, user, router]);
  return authReady && Boolean(user);
}

/**
 * Assistent zum Erstellen eines Treffens. Nach Erfolg kurze Bestätigung, dann Weiterleitung zum Treffen.
 * Rückgabe: Assistent; für Gäste nichts (Weiterleitung zur Anmeldung).
 * Feature: F-17
 */
export function CreateWizard() {
  const { events, notifyDataChanged } = useAppServices();
  const router = useRouter();
  const showToast = useToast();
  const reduceMotion = useReducedMotion();
  const signedIn = useGuestRedirect();
  const [step, setStep] = useState<WizardStep>(1);
  const [draft, setDraft] = useState<EventDraft>(() => createEmptyDraft(new Date()));
  const [errors, setErrors] = useState<DraftErrors>({});
  const [busy, setBusy] = useState(false);
  const [published, setPublished] = useState(false);

  const update = useCallback((patch: Partial<EventDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      Object.keys(patch).forEach((key) => delete next[key as keyof DraftErrors]);
      return next;
    });
  }, []);

  // Next.js hält verlassene Seiten versteckt am Leben (Activity); beim Verstecken startet der Assistent neu.
  useLayoutEffect(
    () => () => {
      if (!published) return;
      setStep(1);
      setDraft(createEmptyDraft(new Date()));
      setErrors({});
      setPublished(false);
    },
    [published],
  );

  if (!signedIn) return <div className={styles.placeholder} aria-busy="true" aria-label="Anmeldung wird geprüft" />;

  const publish = async () => {
    setBusy(true);
    try {
      const created = await events.createEvent(buildEventInput(draft));
      setPublished(true);
      notifyDataChanged();
      window.setTimeout(() => router.push(`/treffen/${encodeURIComponent(created.id)}`), reduceMotion ? 200 : 900);
    } catch (error) {
      if (error instanceof EventError && error.field) {
        setStep(stepOfField(error.field));
        setErrors(toDraftErrors(error));
      } else {
        showToast(error instanceof Error ? error.message : 'Das Treffen konnte nicht gespeichert werden.', 'error');
      }
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    const stepErrors = findStepErrors(draft, step);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;
    if (step < 3) setStep((step + 1) as WizardStep);
    else void publish();
  };

  const stepProps = { draft, errors, onChange: update };
  return (
    <div className={styles.wizard} data-step={step}>
      <header className={styles.header}>
        {step > 1 ? (
          <button type="button" className={styles.back} onClick={() => setStep((step - 1) as WizardStep)} aria-label="Zurück zum vorigen Schritt">
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
        ) : (
          <span className={styles.backSpacer} />
        )}
        <Progress step={step} />
      </header>
      <h1 className={styles.title}>{stepTitles[step]}</h1>
      <form
        className={styles.form}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          next();
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            className={styles.stepFrame}
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && <StepBasics {...stepProps} />}
            {step === 2 && <StepPlaceTime {...stepProps} />}
            {step === 3 && <StepDetails {...stepProps} />}
          </motion.div>
        </AnimatePresence>
        <div className={styles.actions}>
          <button type="submit" className={styles.primary} disabled={busy || published}>
            {step < 3 ? 'Weiter' : 'Veröffentlichen'}
          </button>
        </div>
      </form>
      <AnimatePresence>{published && <SuccessOverlay />}</AnimatePresence>
    </div>
  );
}
