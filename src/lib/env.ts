// Lectura de variables de entorno compatible con Cloudflare Pages.
// En Pages las variables/secretos llegan en tiempo de ejecución (locals.runtime.env),
// no siempre en el build; import.meta.env queda como respaldo (dev local con .env).
type EnvMap = Record<string, string | undefined>;
let runtimeEnv: EnvMap = {};

export function setRuntimeEnv(e: unknown) {
  if (e && typeof e === 'object') runtimeEnv = e as EnvMap;
}

export function env(name: string): string | undefined {
  const v = runtimeEnv[name];
  if (typeof v === 'string' && v) return v;
  const b = (import.meta.env as unknown as EnvMap)[name];
  return typeof b === 'string' && b ? b : undefined;
}
