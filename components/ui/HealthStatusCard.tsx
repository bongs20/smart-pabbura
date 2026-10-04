import MouthIllustration from './MouthIllustration';

interface HealthStatusCardProps {
  vas: number;
  ph: number;
  status?: 'Sehat' | 'Perlu Perhatian' | 'Kritis';
}

/** "Status Mulut" card from the dashboard mockup: illustration + VAS + status. */
export default function HealthStatusCard({
  vas,
  ph,
  status = 'Sehat',
}: HealthStatusCardProps) {
  const isHealthy = status === 'Sehat';
  const statusColor = isHealthy ? '#22C55E' : status === 'Perlu Perhatian' ? '#F59E0B' : '#EF4444';

  return (
    <section className="card p-5" aria-label="Status Mulut">
      <h3 className="text-sm font-bold text-[#1E3A5F] mb-4">Status Mulut</h3>

      <div className="flex items-center gap-5">
        <div
          className="flex-shrink-0 w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ backgroundColor: '#FFF0EB' }}
        >
          <MouthIllustration size={82} />
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">VAS</span>
            <span className="text-sm font-bold text-[#1E3A5F]">{vas}/10</span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Kondisi Mulut</span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusColor }}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold" style={{ color: statusColor }}>
                {status}
              </span>
            </span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">pH</span>
            <span className="text-sm font-bold text-[#3B82F6]">{ph}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
