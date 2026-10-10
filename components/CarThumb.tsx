// A small car photo used as a thumbnail on each booking card and in the
// detail panel. The image path comes from the booking data (files live
// in /public/cars). Kept as a plain <img> so it works without any image
// loader config; the container holds a fixed square and the photo is
// contained inside it.
export function CarThumb({
  src,
  alt,
  size = 56,
  className = "",
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </span>
  );
}
