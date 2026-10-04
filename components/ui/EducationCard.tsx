import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface EducationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  iconBg?: string;
}

export default function EducationCard({
  title,
  description,
  icon,
  href = '#',
  iconBg = '#EEF4FF',
}: EducationCardProps) {
  return (
    <Link
      href={href}
      className="card flex items-center gap-4 p-4 hover:shadow-md transition-shadow"
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1E3A5F]">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{description}</p>
      </div>
      <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
    </Link>
  );
}
