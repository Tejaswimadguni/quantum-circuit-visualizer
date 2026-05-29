type FeatureIconProps = {
  name: 'simulation' | 'state' | 'bloch' | 'playback' | 'probability' | 'learning';
  className?: string;
};

export default function FeatureIcon({ name, className = 'h-6 w-6' }: FeatureIconProps) {
  const stroke = 'currentColor';
  const icons = {
    simulation: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5">
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    state: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5">
        <path d="M4 18l4-8 4 5 4-10 4 13" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bloch: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="9" ry="4" />
        <path d="M12 3v18" />
      </svg>
    ),
    playback: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5">
        <polygon points="8,6 18,12 8,18" fill="currentColor" stroke="none" />
        <rect x="4" y="6" width="2" height="12" rx="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    probability: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5">
        <rect x="4" y="14" width="4" height="6" rx="1" />
        <rect x="10" y="10" width="4" height="10" rx="1" />
        <rect x="16" y="6" width="4" height="14" rx="1" />
      </svg>
    ),
    learning: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5">
        <path d="M12 3l8 4v6c0 4-3.5 7-8 8-4.5-1-8-4-8-8V7l8-4z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return icons[name];
}
