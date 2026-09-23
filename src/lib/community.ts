// Utilidades del foro de comunidad.
export const CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'wins', label: 'Victorias' },
  { id: 'dudas', label: 'Dudas del método' },
  { id: 'plantillas', label: 'Plantillas' },
  { id: 'observatorio', label: 'Observatorio de IAs' },
] as const;

export const MEMBER_ROLES = ['buyer', 'affiliate', 'admin'];

export const isUuid = (v: string | undefined) =>
  !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

