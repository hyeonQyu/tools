import { getCgvSiteSpecialScreensQueryOptions } from '@/features/cgv-alert/queries';
import { CGV_SPECIAL_SCREEN_GRADES } from '@/features/cgv-alert/types';
import { Box, Chip, FormLabel, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

interface CgvSpecialScreenSelectorProps {
  siteNo: string;
  value: string[];
  onChange: (sscnsGradCds: string[]) => void;
}

function CgvSpecialScreenSelector({ siteNo, value, onChange }: CgvSpecialScreenSelectorProps) {
  const { data } = useQuery(getCgvSiteSpecialScreensQueryOptions(siteNo));

  const fallbackOptions = CGV_SPECIAL_SCREEN_GRADES.map(({ code, name }) => ({ code, name }));
  // 극장별 실제 운영 등급을 우선 사용하고, 조회 전이거나 응답이 비어 있으면 전체 상수로 대체한다.
  const baseOptions = data && data.length > 0 ? data : fallbackOptions;

  /**
   * 극장을 바꾸면 옵션 목록이 교체되는데, 이때 이미 선택된 등급이 목록에서 빠지면
   * 화면에는 아무것도 선택 안 된 것처럼 보이지만 저장되는 값에는 그대로 남아 있게 된다.
   * 선택된 코드는 목록에 없더라도 항상 노출해 해제할 수 있게 한다.
   */
  const missingSelected = value
    .filter((code) => !baseOptions.some((option) => option.code === code))
    .map((code) => ({ code, name: fallbackOptions.find((option) => option.code === code)?.name ?? code }));
  const options = [...baseOptions, ...missingSelected];

  const toggle = (code: string) => {
    onChange(value.includes(code) ? value.filter((selected) => selected !== code) : [...value, code]);
  };

  return (
    <Box>
      <FormLabel sx={{ display: 'block', mb: 1 }}>특별관</FormLabel>

      <Stack direction="row" flexWrap="wrap" gap={1}>
        {options.map(({ code, name }) => (
          <Chip
            key={code}
            label={name}
            color={value.includes(code) ? 'primary' : 'default'}
            variant={value.includes(code) ? 'filled' : 'outlined'}
            onClick={() => toggle(code)}
          />
        ))}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        선택하지 않으면 모든 상영관을 감시합니다.
      </Typography>
    </Box>
  );
}

export default CgvSpecialScreenSelector;
