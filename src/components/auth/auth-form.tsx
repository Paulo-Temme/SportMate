'use client';
// Anmelden und Registrieren umschaltbar, im Demo-Modus zusätzlich Demo-Personen; danach Rücksprung zum Ausgangspunkt (F-01, F-02, F-32).
import { motion, useReducedMotion } from 'motion/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { useAppServices } from '@/components/app/app-services';
import { useToast } from '@/components/app/toast-provider';
import { AuthError, type AuthField } from '@/lib/data/auth-gateway';
import { resolveReturnPath } from './return-path';
import styles from './auth-form.module.css';

type AuthMode = 'signIn' | 'signUp';
type FieldErrors = Partial<Record<AuthField | 'form', string>>;

function toFieldErrors(error: unknown): FieldErrors {
  if (error instanceof AuthError) return { [error.field ?? 'form']: error.message };
  return { form: 'Das hat nicht geklappt. Bitte prüfe deine Verbindung und versuche es erneut.' };
}

function TextField(props: {
  label: string;
  name: AuthField;
  type: string;
  autoComplete: string;
  value: string;
  error?: string;
  hint?: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const describedBy = props.error ? `${id}-fehler` : props.hint ? `${id}-hinweis` : undefined;
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {props.label}
      </label>
      <input
        id={id}
        name={props.name}
        type={props.type}
        autoComplete={props.autoComplete}
        className={styles.input}
        value={props.value}
        aria-invalid={Boolean(props.error)}
        aria-describedby={describedBy}
        onChange={(event) => props.onChange(event.target.value)}
      />
      {props.error ? (
        <p id={`${id}-fehler`} className={styles.error}>
          {props.error}
        </p>
      ) : (
        props.hint && (
          <p id={`${id}-hinweis`} className={styles.hint}>
            {props.hint}
          </p>
        )
      )}
    </div>
  );
}

function DemoAccounts({ onDone }: { onDone: (name: string) => void }) {
  const { auth } = useAppServices();
  const [error, setError] = useState('');
  const accounts = auth.listDemoAccounts();
  if (accounts.length === 0) return null;
  const choose = async (id: string) => {
    try {
      const user = await auth.signInAsDemo(id);
      onDone(user.displayName);
    } catch (problem) {
      setError(toFieldErrors(problem).form ?? 'Anmeldung als Demo-Person nicht möglich.');
    }
  };
  return (
    <section className={styles.demo} aria-labelledby="demo-titel">
      <h2 id="demo-titel" className={styles.demoTitle}>
        Als Demo-Person fortfahren
      </h2>
      <p className={styles.demoNote}>Demo-Modus: Daten nur in diesem Browser. Treffen und Teilnahmen setzen sich beim Neuladen zurück.</p>
      <ul className={styles.demoList}>
        {accounts.map((account) => (
          <li key={account.id}>
            <button type="button" className={styles.demoButton} onClick={() => choose(account.id)}>
              <span className={styles.avatar} aria-hidden="true">
                {account.displayName.charAt(0)}
              </span>
              {account.displayName}
              <span className="visually-hidden"> – als Demo-Person anmelden</span>
            </button>
          </li>
        ))}
      </ul>
      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}

/**
 * Formular für Anmelden und Registrieren mit Fehlern direkt am Feld.
 * Liest das Rücksprungziel aus `?weiter=`; ohne Ziel geht es zum Profil.
 * Rückgabe: Formularseite.
 * Feature: F-01, F-02
 */
export function AuthForm() {
  const { auth, mode: dataMode } = useAppServices();
  const router = useRouter();
  const searchParams = useSearchParams();
  const showToast = useToast();
  const reduceMotion = useReducedMotion();
  const returnPath = resolveReturnPath(searchParams.get('weiter'), '/profil');
  const [mode, setMode] = useState<AuthMode>(searchParams.get('modus') === 'registrieren' ? 'signUp' : 'signIn');
  const [values, setValues] = useState({ displayName: '', email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);

  const finish = (name: string) => {
    showToast(`Angemeldet als ${name}`);
    router.replace(returnPath, { scroll: false });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      const user =
        mode === 'signUp'
          ? await auth.signUp(values)
          : await auth.signIn({ email: values.email, password: values.password });
      finish(user.displayName);
    } catch (problem) {
      setErrors(toFieldErrors(problem));
    } finally {
      setBusy(false);
    }
  };

  const update = (field: keyof typeof values) => (value: string) => setValues((current) => ({ ...current, [field]: value }));
  const switchMode = (next: AuthMode) => {
    setMode(next);
    setErrors({});
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{mode === 'signIn' ? 'Anmelden' : 'Konto erstellen'}</h1>
      <p className={styles.lead}>
        {returnPath.startsWith('/treffen/') ? 'Melde dich an, um mitzumachen. Danach geht es zurück zum Treffen.' : 'Stöbern geht ohne Konto. Zum Mitmachen und Erstellen brauchst du eins.'}
      </p>
      <div className={styles.switch} role="tablist" aria-label="Anmelden oder registrieren">
        {(['signIn', 'signUp'] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={mode === option}
            className={styles.switchButton}
            onClick={() => switchMode(option)}
          >
            {mode === option && (
              <motion.span layoutId="auth-switch" className={styles.switchThumb} transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 38 }} />
            )}
            <span className={styles.switchLabel}>{option === 'signIn' ? 'Anmelden' : 'Registrieren'}</span>
          </button>
        ))}
      </div>
      <form className={styles.form} onSubmit={submit} noValidate>
        {mode === 'signUp' && (
          <TextField label="Anzeigename" name="displayName" type="text" autoComplete="nickname" value={values.displayName} error={errors.displayName} hint="Sehen andere Teilnehmende, z. B. dein Vorname." onChange={update('displayName')} />
        )}
        <TextField label="E-Mail" name="email" type="email" autoComplete="email" value={values.email} error={errors.email} onChange={update('email')} />
        <TextField
          label="Passwort"
          name="password"
          type="password"
          autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'}
          value={values.password}
          error={errors.password}
          hint={mode === 'signUp' ? 'Mindestens 8 Zeichen.' : undefined}
          onChange={update('password')}
        />
        {errors.form && (
          <p className={styles.formError} role="alert">
            {errors.form}
          </p>
        )}
        <button type="submit" className={styles.submit} disabled={busy}>
          {mode === 'signIn' ? 'Anmelden' : 'Registrieren'}
        </button>
      </form>
      {dataMode === 'local' && <DemoAccounts onDone={finish} />}
    </div>
  );
}
