import { getCgvCatalogQueryOptions } from '@/features/cgv-alert/queries';
import { CgvMovie } from '@/features/cgv-alert/types';
import { Autocomplete, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

interface CgvMovieSelectorProps {
  value: CgvMovie | null;
  onChange: (movie: CgvMovie | null) => void;
}

function CgvMovieSelector({ value, onChange }: CgvMovieSelectorProps) {
  const { data, isLoading } = useQuery(getCgvCatalogQueryOptions());

  return (
    <Autocomplete
      options={data?.movies ?? []}
      value={value}
      onChange={(_, movie) => onChange(movie)}
      loading={isLoading}
      getOptionLabel={(movie) => movie.movNm}
      isOptionEqualToValue={(option, selected) => option.movNo === selected.movNo}
      noOptionsText="검색 결과가 없습니다."
      renderInput={(params) => <TextField {...params} label="영화" placeholder="미지정 시 모든 영화" />}
    />
  );
}

export default CgvMovieSelector;
