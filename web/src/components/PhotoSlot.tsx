import { ImageSlot } from '@/components/ImageSlot';
import { useLanguage } from '@/hooks/useLanguage';
import type { TourismPhoto } from '@/lib/tourismData';
import { cn } from '@/lib/utils';

interface PhotoSlotProps {
  photo?: TourismPhoto;
  /** Placeholder prompt, shown while the slot has no photo. */
  label?: string;
  /** How wide the slot renders, so the browser picks the 800 px or the large file. */
  sizes: string;
  /** In a card whose heading already names the place: empty alt, so a linked card's
   * accessible name stays the place name instead of the photo description. */
  decorative?: boolean;
  /** For a hero at the top of the page. */
  eager?: boolean;
  className?: string;
}

// A Visit Mati photo slot: the sourced photo when there is one, otherwise ImageSlot's
// labelled placeholder.
export function PhotoSlot({ photo, label, sizes, decorative, eager, className }: PhotoSlotProps) {
  if (!photo) return <ImageSlot label={label} className={className} />;
  return (
    <ImageSlot
      src={photo.src}
      srcSet={`${photo.srcSmall} 800w, ${photo.src} ${photo.width}w`}
      sizes={sizes}
      alt={decorative ? '' : photo.alt}
      eager={eager}
      className={className}
    />
  );
}

/** "Photo: City Government of Mati", or "Photo: Kleomarlo, CC BY-SA 3.0" for a licensed photo. */
export function PhotoCredit({ photo, className }: { photo: TourismPhoto; className?: string }) {
  const { t } = useLanguage();
  return (
    <span className={cn('text-[0.6875rem] leading-snug', className)}>
      {photo.license
        ? t('photo-credit-license', { by: photo.by, license: photo.license })
        : t('photo-credit', { by: photo.by })}
    </span>
  );
}
