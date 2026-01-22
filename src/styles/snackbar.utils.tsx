import { TIME_UNIT } from '@/lib';
import { Close } from '@mui/icons-material';
import { closeSnackbar, enqueueSnackbar, OptionsWithExtraProps, SnackbarKey, SnackbarMessage, VariantType } from 'notistack';

export const enqueueClosableSnackbar = <V extends VariantType>(
  options: OptionsWithExtraProps<V> & { message?: SnackbarMessage },
): SnackbarKey => {
  const { autoHideDuration = TIME_UNIT.unitOfMs.asSecond * 3 } = options;

  const snackbarKey = enqueueSnackbar({
    ...(options as object),
    autoHideDuration,
    action: <Close sx={{ cursor: 'pointer' }} onClick={() => closeSnackbar(snackbarKey)} />,
  });

  return snackbarKey;
};
