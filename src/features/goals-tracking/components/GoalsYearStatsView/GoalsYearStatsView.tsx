import { ToolLayout } from '@/components/ToolLayout';
import GoalsYearlyYearPicker from '@/features/goals-tracking/components/GoalsYearStatsView/GoalsYearlyYearPicker';
import GoalsYearStats from '@/features/goals-tracking/components/GoalsYearStatsView/GoalsYearStats';
import GoalsYearStatsSkeleton from '@/features/goals-tracking/components/GoalsYearStatsView/GoalsYearStatsSkeleton';
import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { Suspense, useState } from 'react';

function GoalsYearStatsView() {
  const [search, setSearch] = useState('');

  return (
    <ToolLayout>
      <ToolLayout.Header sx={{ px: 1 }}>
        <GoalsYearlyYearPicker />
      </ToolLayout.Header>

      <ToolLayout.Body>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="목표 검색"
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Suspense fallback={<GoalsYearStatsSkeleton />}>
          <GoalsYearStats search={search} />
        </Suspense>
      </ToolLayout.Body>
    </ToolLayout>
  );
}

export default GoalsYearStatsView;
