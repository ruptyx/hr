// /app/hr/employees/_components/search.tsx
'use client';

import { Search as SearchIcon } from 'lucide-react';

type SearchProps = {
  placeholder: string;
  onSearchChange: (term: string) => void;
};

export function Search({ placeholder, onSearchChange }: SearchProps) {
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-neutral-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-neutral-500"
        placeholder={placeholder}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
    </div>
  );
}
