import { useState, useMemo } from 'react';

// Calculadora de ROI AEO — proyecta ingresos incrementales por menciones IA.
export default function ROICalculator() {
  const [ticket, setTicket] = useState(500000);
  const [conversion, setConversion] = useState(10);   // %
  const [consultasMes, setConsultasMes] = useState(500); // volumen mensual estimado
  const [aparicionesActual, setAparicionesActual] = useState(2); // % que la IA te menciona hoy
  const [aparicionesObjetivo, setAparicionesObjetivo] = useState(35);
  const [meses, setMeses] = useState(6);

  const proyeccion = useMemo(() => {
    const results: { mes: number; menciones: number; revenue: number; acumulado: number }[] = [];
    let acumulado = 0;
    const step = (aparicionesObjetivo - aparicionesActual) / meses;
    for (let m = 1; m <= meses; m++) {
      const pct = aparicionesActual + step * m;
      const menciones = (consultasMes * pct) / 100;
      const clientes = (menciones * conversion) / 100;
      const revenue = clientes * ticket;
      acumulado += revenue;
      results.push({ mes: m, menciones: Math.round(menciones), revenue, acumulado });
    }
    return results;
  }, [ticket, conversion, consultasMes, aparicionesActual, aparicionesObjetivo, meses]);

  const totalRevenue = proyeccion[proyeccion.length - 1]?.acumulado || 0;
  const maxRevenue = Math.max(...proyeccion.map(p => p.revenue));

  const fmt = (n: number) => 'COP ' + n.toLocaleString('es-CO', { maximumFractionDigits: 0 });

  const inputClass = 'w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-aurora-violet transition';
  const labelClass = 'block text-xs uppercase tracking-widest text-text-mute mb-1';

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">Tus supuestos</h3>
        <div><label className={labelClass}>Ticket promedio (COP)</label><input type="number" className={inputClass} value={ticket} onChange={e => setTicket(Number(e.target.value))} /></div>
        <div><label className={labelClass}>Tasa de conversión (%)</label><input type="number" className={inputClass} value={conversion} onChange={e => setConversion(Number(e.target.value))} /></div>
        <div><label className={labelClass}>Consultas IA mensuales estimadas en tu categoría</label><input type="number" className={inputClass} value={consultasMes} onChange={e => setConsultasMes(Number(e.target.value))} /></div>
        <div><label className={labelClass}>% de menciones IA hoy</label><input type="number" className={inputClass} value={aparicionesActual} onChange={e => setAparicionesActual(Number(e.target.value))} /></div>
        <div><label className={labelClass}>% de menciones IA objetivo</label><input type="number" className={inputClass} value={aparicionesObjetivo} onChange={e => setAparicionesObjetivo(Number(e.target.value))} /></div>
        <div><label className={labelClass}>Horizonte (meses)</label><input type="number" className={inputClass} value={meses} onChange={e => setMeses(Number(e.target.value))} min={1} max={24} /></div>
      </div>

      <div className="glass rounded-2xl p-6">
        <p className="kicker mb-2">Ingreso acumulado proyectado</p>
        <p className="font-display text-4xl font-semibold text-grad-vc">{fmt(totalRevenue)}</p>
        <p className="text-xs text-text-mute mt-1">Sobre {meses} meses, con la trayectoria definida.</p>

        <div className="mt-6 space-y-2">
          {proyeccion.map(p => (
            <div key={p.mes} className="flex items-center gap-3">
              <span className="text-xs w-14 text-text-mute">Mes {p.mes}</span>
              <div className="flex-1 h-2 bg-bg-elevated rounded overflow-hidden">
                <div className="h-full bg-grad-vc" style={{ width: `${(p.revenue / maxRevenue) * 100}%` }} />
              </div>
              <span className="text-xs w-32 text-right">{fmt(p.revenue)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl border border-aurora-violet/40 bg-aurora-violet/10">
          <p className="text-xs font-semibold text-aurora-violet2">Recuerda</p>
          <p className="text-xs text-text-soft mt-1">
            Es una proyección — asume que ejecutas el método CITAR de forma consistente.
            El método completo con las 6 fases + comunidad + auditor Pro está a un cambio de tu suscripción.
          </p>
        </div>
      </div>
    </div>
  );
}
