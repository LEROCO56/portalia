import { useState, useMemo } from 'react';

type BusinessType = 'Organization' | 'LocalBusiness' | 'ProfessionalService' | 'Restaurant' | 'Store' | 'SoftwareApplication' | 'MedicalBusiness';

export default function SchemaGenerator() {
  const [type, setType] = useState<BusinessType>('LocalBusiness');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [locality, setLocality] = useState('Bogotá');
  const [region, setRegion] = useState('Cundinamarca');
  const [country, setCountry] = useState('CO');
  const [socials, setSocials] = useState('https://linkedin.com/company/mi-negocio\nhttps://instagram.com/minegocio');
  const [priceRange, setPriceRange] = useState('$$');
  const [openingHours, setOpeningHours] = useState('Mo-Fr 08:00-18:00, Sa 09:00-14:00');
  const [copied, setCopied] = useState(false);

  const schema = useMemo(() => {
    const s: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': type,
      name,
      url,
      description,
    };
    if (email) s.email = email;
    if (phone) {
      s.contactPoint = { '@type': 'ContactPoint', telephone: phone, contactType: 'customer service', availableLanguage: ['es', 'en'] };
    }
    if (street || locality) {
      s.address = { '@type': 'PostalAddress', streetAddress: street, addressLocality: locality, addressRegion: region, addressCountry: country };
    }
    const sameAs = socials.split('\n').map(x => x.trim()).filter(Boolean);
    if (sameAs.length) s.sameAs = sameAs;
    if (type === 'LocalBusiness' || type === 'Restaurant' || type === 'Store' || type === 'ProfessionalService' || type === 'MedicalBusiness') {
      if (priceRange) s.priceRange = priceRange;
      if (openingHours) s.openingHoursSpecification = openingHours;
    }
    return s;
  }, [type, name, url, description, phone, email, street, locality, region, country, socials, priceRange, openingHours]);

  const jsonStr = JSON.stringify(schema, null, 2);
  const embed = `<script type="application/ld+json">\n${jsonStr}\n</script>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(embed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  const inputClass = 'w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-aurora-violet transition';
  const labelClass = 'block text-xs uppercase tracking-widest text-text-mute mb-1';

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Datos de tu negocio</h3>
        <div>
          <label className={labelClass}>Tipo de entidad</label>
          <select value={type} onChange={(e) => setType(e.target.value as BusinessType)} className={inputClass}>
            <option value="Organization">Organization (organización)</option>
            <option value="LocalBusiness">LocalBusiness (negocio local)</option>
            <option value="ProfessionalService">ProfessionalService (servicio profesional)</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Store">Store (tienda)</option>
            <option value="SoftwareApplication">SoftwareApplication (SaaS/app)</option>
            <option value="MedicalBusiness">MedicalBusiness (salud)</option>
          </select>
        </div>
        <div><label className={labelClass}>Nombre</label><input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="Café Origen Bogotá" /></div>
        <div><label className={labelClass}>URL</label><input className={inputClass} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://cafeorigen.co" /></div>
        <div><label className={labelClass}>Descripción (1 línea)</label><input className={inputClass} value={description} onChange={e => setDescription(e.target.value)} placeholder="Cafetería de especialidad en La Candelaria, granos de origen Colombia." /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Email</label><input className={inputClass} value={email} onChange={e => setEmail(e.target.value)} placeholder="hola@..." /></div>
          <div><label className={labelClass}>Teléfono</label><input className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+57-1-..." /></div>
        </div>
        <div><label className={labelClass}>Calle / dirección</label><input className={inputClass} value={street} onChange={e => setStreet(e.target.value)} placeholder="Cra 7 # 12-34" /></div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={labelClass}>Ciudad</label><input className={inputClass} value={locality} onChange={e => setLocality(e.target.value)} /></div>
          <div><label className={labelClass}>Región</label><input className={inputClass} value={region} onChange={e => setRegion(e.target.value)} /></div>
          <div><label className={labelClass}>País</label><input className={inputClass} value={country} onChange={e => setCountry(e.target.value)} /></div>
        </div>
        <div>
          <label className={labelClass}>Perfiles sociales (uno por línea, para sameAs)</label>
          <textarea className={inputClass} rows={3} value={socials} onChange={e => setSocials(e.target.value)} />
        </div>
        {(type !== 'Organization' && type !== 'SoftwareApplication') && (
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>Rango de precios</label><input className={inputClass} value={priceRange} onChange={e => setPriceRange(e.target.value)} placeholder="$$" /></div>
            <div><label className={labelClass}>Horario</label><input className={inputClass} value={openingHours} onChange={e => setOpeningHours(e.target.value)} placeholder="Mo-Fr 08:00-18:00" /></div>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-semibold">Schema listo para copiar</h3>
          <button onClick={copy} className="btn-primary text-xs px-4 py-1.5">{copied ? '✓ Copiado' : 'Copiar'}</button>
        </div>
        <pre className="text-xs bg-bg-elevated rounded-lg p-4 overflow-auto max-h-[520px] leading-relaxed"><code>{embed}</code></pre>
        <p className="text-xs text-text-mute mt-3">
          Pega esto justo antes de <code className="text-aurora-cyan">{'</head>'}</code> en tu web. Las IAs lo detectan en la próxima indexación.
        </p>
      </div>
    </div>
  );
}
