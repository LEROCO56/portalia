// Curso Portalia: catálogo de lecciones (fuente: content/lecciones/*.md) y video firmado de Bunny Stream.
// Mientras no haya video grabado, cada lección se entrega como guía escrita completa;
// cuando Leo suba los videos basta con cargar BUNNY_* (ver docs/DEPLOY.md) y aparecen arriba del texto.
import { env } from '@/lib/env';

export interface Lesson {
  id: string; // L1..L8 — clave en course_progress.lesson_id
  n: number;
  slug: string;
  title: string;
  duration: string;
}

export const LESSONS: Lesson[] = [
  { id: 'L1', n: 1, slug: '01-fundamentos-aeo', title: 'Fundamentos AEO/GEO', duration: '22 min + 15 min lectura' },
  { id: 'L2', n: 2, slug: '02-paso-c-contextualizar', title: 'Paso C — Contextualizar tu negocio', duration: '31 min + 20 min ejercicio' },
  { id: 'L3', n: 3, slug: '03-paso-i-indexar-schema', title: 'Paso I — Indexar con Schema.org', duration: '29 min + 30 min ejercicio' },
  { id: 'L4', n: 4, slug: '04-paso-t-testimoniar', title: 'Paso T — Testimoniar con menciones externas', duration: '25 min + 45 min ejercicio' },
  { id: 'L5', n: 5, slug: '05-paso-a-automatizar', title: 'Paso A — Automatizar el contenido citable', duration: '20 min + 40 min configuración' },
  { id: 'L6', n: 6, slug: '06-paso-r-revisar', title: 'Paso R — Revisar cada mes', duration: '18 min + 45 min primera revisión' },
  { id: 'L7', n: 7, slug: '07-plan-30-dias', title: 'Tu plan CITAR de 30 días', duration: '17 min + plan' },
  { id: 'L8', n: 8, slug: '08-caso-real-negocio-local', title: 'Caso real: un negocio local de invisible a top-3', duration: '34 min + 20 min ejercicio' },
];

export const COURSE_ROLES = ['buyer', 'affiliate', 'admin'] as const;

export function canAccessCourse(role: string | undefined | null) {
  return !!role && (COURSE_ROLES as readonly string[]).includes(role);
}

export function lessonBySlug(slug: string | undefined) {
  return LESSONS.find((l) => l.slug === slug);
}

/**
 * URL de embed firmada de Bunny Stream (Token Authentication del Video Library).
 * token = SHA256_hex(TOKEN_KEY + VIDEO_ID + EXPIRES). Devuelve null si falta configuración o video.
 * Variables: BUNNY_LIBRARY_ID, BUNNY_TOKEN_KEY (secreto), BUNNY_VIDEO_IDS = {"L1":"<guid>",...}.
 */
export async function signedVideoUrl(lessonId: string, ttlSeconds = 4 * 3600): Promise<string | null> {
  const library = env('BUNNY_LIBRARY_ID');
  const key = env('BUNNY_TOKEN_KEY');
  const idsRaw = env('BUNNY_VIDEO_IDS');
  if (!library || !key || !idsRaw) return null;
  let ids: Record<string, string>;
  try {
    ids = JSON.parse(idsRaw);
  } catch {
    return null;
  }
  const video = ids[lessonId];
  if (!video || !/^[0-9a-f-]{36}$/i.test(video)) return null;
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${key}${video}${expires}`));
  const token = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `https://iframe.mediadelivery.net/embed/${encodeURIComponent(library)}/${video}?token=${token}&expires=${expires}&autoplay=false&preload=false`;
}
