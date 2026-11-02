import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageSlotProps {
  /** When set, the photo is rendered cover-fit. Otherwise a labelled placeholder shows. */
  src?: string;
  /** Responsive candidates for a filled slot, e.g. "a-sm.webp 800w, a.webp 1600w". */
  srcSet?: string;
  sizes?: string;
  /** Above-the-fold photos (heroes) load straight away instead of lazily. */
  eager?: boolean;
  alt?: string;
  /** Prompt shown in the empty placeholder — tells an editor what belongs here. */
  label?: string;
  className?: string;
}

// React counterpart of the design canvas's <image-slot>: a fillable image region.
// Filled slots render the photo; empty slots render an honest "photo pending" panel
// so the LGU can see exactly where a Dahican / coastline / map image belongs.
export function ImageSlot({
  src,
  srcSet,
  sizes,
  eager,
  alt = '',
  label,
  className,
}: ImageSlotProps) {
  if (src) {
    return (
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={cn('size-full object-cover', className)}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={label || 'Image placeholder'}
      className={cn(
        'flex size-full flex-col items-center justify-center gap-2 border border-line bg-surface-subtle p-6 text-center text-ink-muted',
        className
      )}
    >
      <ImageIcon className="size-6 opacity-50" aria-hidden="true" />
      {label ? (
        <span className="max-w-[240px] text-xs leading-snug opacity-70">{label}</span>
      ) : null}
    </div>
  );
}
