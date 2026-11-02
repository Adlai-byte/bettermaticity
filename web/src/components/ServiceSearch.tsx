import { useState, useMemo } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';
import Fuse from 'fuse.js';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { services, type Service } from '@/lib/services';

// Fuzzy index over the service directory (mirrors the legacy search.js weighting).
const fuse = new Fuse(services, {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'keywords', weight: 2 },
    { name: 'category', weight: 1 },
    { name: 'office', weight: 1 },
    { name: 'description', weight: 1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
});

interface ServiceSearchProps {
  placeholder?: string;
  className?: string;
}

// Reused by the Services landing and the home hero; its last option opens /search. shadcn Command drives keyboard
// nav + a11y; Fuse.js drives fuzzy matching (Command's own filter is disabled).
// Results float below the field as an overlay, so the surrounding card and section keep
// their height; they close on Escape or when focus leaves the search.
export function ServiceSearch({ placeholder, className }: ServiceSearchProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const results: Service[] = useMemo(
    () =>
      query.trim().length >= 2
        ? fuse
            .search(query)
            .slice(0, 8)
            .map((r) => r.item)
        : [],
    [query]
  );
  const showList = open && query.trim().length >= 2;

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <Command
      shouldFilter={false}
      onFocus={() => setOpen(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative overflow-visible rounded-btn border border-line bg-white p-0 text-left transition-[border-color,box-shadow]',
        'focus-within:border-royal focus-within:ring-3 focus-within:ring-royal/20',
        className
      )}
    >
      <CommandInput
        value={query}
        onValueChange={(v) => {
          setQuery(v);
          setOpen(true);
        }}
        placeholder={placeholder || t('service-search-default-placeholder')}
      />
      {showList && (
        <CommandList
          // Keep focus in the input while a result is clicked, so blur doesn't close the
          // list before the selection registers.
          onMouseDown={(e) => e.preventDefault()}
          className="absolute top-full -right-px -left-px z-50 mt-1 max-h-80 border border-line bg-white p-1 text-ink shadow-[0_12px_32px_rgba(15,23,42,0.16)]"
        >
          {results.length === 0 && <CommandEmpty>{t('service-search-no-results')}</CommandEmpty>}
          {results.map((s) => (
            <CommandItem
              key={s.id}
              value={s.id}
              onSelect={() => {
                window.location.href = s.path;
              }}
              className="flex flex-col items-start gap-0.5"
            >
              <span className="font-medium text-foreground">{s.title}</span>
              <span className="text-xs text-ink-muted">
                {s.category}
                {s.office ? ` · ${s.office}` : ''}
              </span>
            </CommandItem>
          ))}
          {/* Always last: hand the query to site-wide search. */}
          <CommandItem
            value="__site-search"
            onSelect={() => {
              window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
            }}
            className="mt-1 border-t border-line font-semibold text-royal"
          >
            {t('search-everything')} · “{query.trim()}”
          </CommandItem>
        </CommandList>
      )}
    </Command>
  );
}
