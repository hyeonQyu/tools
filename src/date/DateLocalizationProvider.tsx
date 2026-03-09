import { dateFormat } from '@/date/date.constants';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';
import { ReactNode } from 'react';

interface DateLocalizationProviderProps {
  children: ReactNode;
}

function DateLocalizationProvider({ children }: DateLocalizationProviderProps) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="ko"
      dateFormats={{ normalDate: dateFormat, keyboardDate: dateFormat }}
      localeText={{ okButtonLabel: '확인', cancelButtonLabel: '취소', datePickerToolbarTitle: '날짜 선택' }}
    >
      {children}
    </LocalizationProvider>
  );
}

export default DateLocalizationProvider;
