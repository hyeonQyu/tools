import { getDaisoProductSearchQueryOptions } from '@/features/daiso-shopping/queries';
import { DaisoProduct } from '@/features/daiso-shopping/types';
import { TIME_UNIT } from '@/lib';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'es-toolkit';
import { useEffect, useMemo, useRef, useState } from 'react';

/** 타자를 치는 도중이 아니라 멈춘 뒤 한 번만 검색한다. */
const SEARCH_DEBOUNCE_MS = TIME_UNIT.unitOfMs.asSecond * 0.4;

export const useDaisoProductSearch = () => {
  const [inputKeyword, setInputKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<DaisoProduct[]>([]);

  const updateSearchKeyword = useRef(debounce(setSearchKeyword, SEARCH_DEBOUNCE_MS)).current;

  useEffect(() => () => updateSearchKeyword.cancel(), [updateSearchKeyword]);

  const { data, isFetching, isError } = useQuery(getDaisoProductSearchQueryOptions(searchKeyword, page));

  useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [searchKeyword]);

  useEffect(() => {
    if (!data) return;

    setAccumulated((previous) => {
      if (page === 1) return data.products;

      const existingIds = new Set(previous.map((product) => product.id));
      return [...previous, ...data.products.filter((product) => !existingIds.has(product.id))];
    });
  }, [data, page]);

  const products = useMemo(() => (page === 1 && data ? data.products : accumulated), [page, data, accumulated]);
  const total = data?.total ?? 0;

  return {
    keyword: inputKeyword,
    setKeyword: (value: string) => {
      setInputKeyword(value);
      updateSearchKeyword(value);
    },
    products,
    total,
    hasMore: products.length > 0 && products.length < total,
    isFetching,
    isError,
    isSearched: searchKeyword.trim().length > 0,
    loadMore: () => setPage((previous) => previous + 1),
  };
};
