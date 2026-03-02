import NavigationPicker from '@/features/goals-tracking/components/shared/NavigationPicker';
import { useGoalsTrackingYearStore } from '@/features/goals-tracking/stores';
import { getKstNow } from '@/lib';

function GoalsYearlyYearPicker() {
  const { year, setYear } = useGoalsTrackingYearStore();
  const currentYear = getKstNow().getFullYear();
  const isCurrentYear = year === currentYear;

  const handlePrevYear = () => setYear(year - 1);
  const handleNextYear = () => setYear(year + 1);
  const handleGoCurrentYear = () => setYear(currentYear);

  return (
    <NavigationPicker
      label={`${year}년`}
      onPrev={handlePrevYear}
      onNext={handleNextYear}
      disableNext={isCurrentYear}
      jumpButtonLabel="올해로"
      onJump={handleGoCurrentYear}
      showJumpButton={!isCurrentYear}
    />
  );
}

export default GoalsYearlyYearPicker;
