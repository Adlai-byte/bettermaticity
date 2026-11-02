import { useEffect, useState } from 'react';
import { HeartHandshake, Mail } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const STORAGE_KEY = 'bs-vol-popup-v1';

// First-visit volunteer invite (localStorage-gated, ~800ms delay). Mirrors the legacy
// volunteer-popup.js; rebuilt on shadcn Dialog. Client-only (no SSR flash).
export default function VolunteerDialog() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let shown = false;
    try {
      shown = localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      /* Safari private mode */
    }
    if (shown) return;
    const timer = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = (next: boolean) => {
    setOpen(next);
    if (!next) {
      try {
        localStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={dismiss}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HeartHandshake className="size-6" aria-hidden="true" />
          </div>
          <DialogTitle>{t('volunteer-dialog-title')}</DialogTitle>
          <DialogDescription>
            {t('volunteer-dialog-desc')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <a
            href="mailto:volunteer@bettermati.org"
            className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            onClick={() => dismiss(false)}
          >
            <Mail className="size-4" aria-hidden="true" />
            {t('volunteer-dialog-cta')}
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
