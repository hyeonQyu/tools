import { getDaisoStoreSearchQueryOptions } from '@/features/daiso-shopping/queries';
import { useDaisoShoppingStore } from '@/features/daiso-shopping/stores';
import { TIME_UNIT } from '@/lib';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'es-toolkit';
import { useEffect, useRef, useState } from 'react';

/** 타자를 치는 도중이 아니라 멈춘 뒤 한 번만 검색한다. */
const SEARCH_DEBOUNCE_MS = TIME_UNIT.unitOfMs.asSecond * 0.4;

export const useDaisoStoreSearch = () => {
  const items = useDaisoShoppingStore((s) => s.items);
  const [inputKeyword, setInputKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const updateSearchKeyword = useRef(debounce(setSearchKeyword, SEARCH_DEBOUNCE_MS)).current;

  useEffect(() => () => updateSearchKeyword.cancel(), [updateSearchKeyword]);

  // 담긴 상품이 있으면 실제 상품 ID로 조회해 프로브 ID 의존을 줄인다.
  const { data, isFetching, isError } = useQuery(getDaisoStoreSearchQueryOptions(searchKeyword, items[0]?.productId));

  return {
    keyword: inputKeyword,
    setKeyword: (value: string) => {
      setInputKeyword(value);
      updateSearchKeyword(value);
    },
    stores: data ?? [],
    isFetching,
    isError,
    isSearched: searchKeyword.trim().length > 0,
  };
};
