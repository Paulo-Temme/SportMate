// Angemeldete Person, wie Oberfläche und Datenzugriff sie kennen (F-01).

/** Angemeldete Person. `email` ist `null` bei Demo-Konten. */
export interface AuthUser {
  id: string;
  displayName: string;
  email: string | null;
}
