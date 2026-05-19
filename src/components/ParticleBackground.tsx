const particles = [
  { size: 8, left: '10%', top: '15%', delay: '0s', duration: '10s' },
  { size: 10, left: '80%', top: '12%', delay: '2s', duration: '12s' },
  { size: 6, left: '35%', top: '72%', delay: '1s', duration: '9s' },
  { size: 12, left: '65%', top: '45%', delay: '3s', duration: '14s' },
  { size: 7, left: '18%', top: '40%', delay: '1.5s', duration: '11s' },
];

export default function ParticleBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(79,247,228,0.05),_transparent_42%)]" />
      {particles.map((particle, index) => (
        <span
          key={index}
          className="particle"
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
