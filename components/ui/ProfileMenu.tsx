import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ProfileMenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface ProfileMenuProps {
  items: ProfileMenuItem[];
}

/** Grouped menu list used in "Profil Kesehatan" section. */
export default function ProfileMenu({ items }: ProfileMenuProps) {
  return (
    <nav className="card overflow-hidden" aria-label="Menu profil">
      {items.map(({ label, icon, href }, index) => (
        <Link
          key={label}
          href={href}
          className="flex items-center gap-4 px-4 py-4 hover:bg-[#F8FAFF] transition-colors focus-visible:bg-[#F8FAFF]"
          style={{
            borderBottom: index < items.length - 1 ? '1px solid #F1F5F9' : 'none',
          }}
        >
          <span className="w-8 h-8 rounded-xl bg-[#EEF4FF] flex items-center justify-center flex-shrink-0">
            {icon}
          </span>
          <span className="flex-1 text-sm text-[#1E3A5F] font-medium">{label}</span>
          <ChevronRight size={16} className="text-gray-300" aria-hidden="true" />
        </Link>
      ))}
    </nav>
  );
}
