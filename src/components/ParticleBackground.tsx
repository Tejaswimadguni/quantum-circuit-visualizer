const particles = [
  { className: 'particle-cyan', size: 120, left: '8%', top: '12%', delay: '0s', duration: '14s' },
  { className: 'particle-violet', size: 160, left: '78%', top: '8%', delay: '2s', duration: '16s' },
  { className: 'particle-cyan', size: 80, left: '42%', top: '68%', delay: '1s', duration: '12s' },
  { className: 'particle-violet', size: 100, left: '88%', top: '55%', delay: '3s', duration: '15s' },
  { className: 'particle-cyan', size: 60, left: '18%', top: '48%', delay: '1.5s', duration: '11s' },
];

export default function ParticleBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.08),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.08),_transparent_45%)]" />
      {particles.map((particle, index) => (
        <span
          key={index}
          className={`particle ${particle.className}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: particle.left,
            top: particle.top,
            animationDuration: particle.duration,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
