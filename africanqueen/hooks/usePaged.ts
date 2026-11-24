'use client';
import { useEffect, useState } from 'react';

export function usePaged<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [page, pageCount]);
  const start = (page - 1) * pageSize;
  return { page, setPage, pageCount, pageItems: items.slice(start, start + pageSize), total: items.length };
}
