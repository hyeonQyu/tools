import { getCgvCatalogQueryOptions } from '@/features/cgv-alert/queries';
import { CgvSite } from '@/features/cgv-alert/types';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

interface CgvTheaterSelectorProps {
  value: CgvSite | null;
  onChange: (site: CgvSite | null) => void;
}

function CgvTheaterSelector({ value, onChange }: CgvTheaterSelectorProps) {
  const { data, isLoading, isError } = useQuery(getCgvCatalogQueryOptions());

  const regionNameByCode = new Map((data?.regions ?? []).map((region) => [region.regnGrpCd, region.regnGrpNm]));
  const options = data?.sites ?? [];

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, site) => onChange(site)}
      loading={isLoading}
      groupBy={(site) => regionNameByCode.get(site.regnGrpCd) ?? '기타'}
      getOptionLabel={(site) => site.siteNm}
      isOptionEqualToValue={(option, selected) => option.siteNo === selected.siteNo}
      noOptionsText={isError ? '극장 목록을 불러오지 못했습니다.' : '검색 결과가 없습니다.'}
      renderInput={(params) => (
        <TextField
          {...params}
          label="극장"
          placeholder="예: 용산아이파크몰"
          required
          error={isError}
          helperText={isError ? '극장 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.' : undefined}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}

export default CgvTheaterSelector;
