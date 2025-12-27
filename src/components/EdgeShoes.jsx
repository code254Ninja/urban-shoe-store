const EdgeShoes = ({ images = [] }) => {
  if (!images.length) return null;

  const left = images.slice(0, 3);
  const right = images.slice(3, 6);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 hidden lg:block">
      <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-white via-white/70 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-white via-white/70 to-transparent" />

      <div className="absolute left-4 top-24 flex flex-col gap-6 opacity-70">
        {left.map((src, idx) => (
          <div
            key={`left-${idx}`}
            className="w-28 h-28 rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white/70 backdrop-blur-sm"
            style={{ transform: `rotate(${idx === 1 ? -10 : -6}deg)` }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>

      <div className="absolute right-4 top-40 flex flex-col gap-6 opacity-70">
        {right.map((src, idx) => (
          <div
            key={`right-${idx}`}
            className="w-28 h-28 rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white/70 backdrop-blur-sm"
            style={{ transform: `rotate(${idx === 1 ? 10 : 6}deg)` }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EdgeShoes;
