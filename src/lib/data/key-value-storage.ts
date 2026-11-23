// Kleinster gemeinsamer Nenner von localStorage und einem Speicher im Arbeitsspeicher (F-00, F-32).

/** Der Teil von `Storage`, den der lokale Modus braucht. In Tests und auf dem Server reicht ein Ersatz im Speicher. */
export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;

/**
 * Erzeugt einen Speicher im Arbeitsspeicher. Ersatz, wenn kein localStorage verfügbar ist (Server, Tests).
 * Rückgabe: neues, leeres Objekt mit `getItem` und `setItem`.
 * Feature: F-00
 */
export function createMemoryStorage(): KeyValueStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}

/**
 * Liest JSON aus dem Speicher und prüft die Form.
 * Eingaben: Speicher, Schlüssel, Prüffunktion. Rückgabe: geprüfter Wert oder `null` bei fehlenden oder beschädigten Daten.
 * Feature: F-32
 */
export function readJson<T>(storage: KeyValueStorage, key: string, isValid: (value: unknown) => value is T): T | null {
  const text = storage.getItem(key);
  if (text === null) return null;
  try {
    const parsed: unknown = JSON.parse(text);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null; // Beschädigte Daten: wie beim ersten Start behandeln.
  }
}
