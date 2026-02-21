import CheckIcon from '@mui/icons-material/Check';
import { Box, Grid } from '@mui/material';

export interface ColorSelectorProps {
  colors: readonly string[];
  value: string;
  onChange: (color: string) => void;
  error?: boolean;
}

function ColorSelector({ colors, value, onChange, error }: ColorSelectorProps) {
  return (
    <Grid container spacing={2}>
      {colors.map((color) => (
        <Grid key={color}>
          <Box
            onClick={() => onChange(color)}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: color,
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: error ? '2px solid' : '2px solid transparent',
              borderColor: error ? 'error.main' : 'transparent',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: 2,
              },
            }}
          >
            {value === color && (
              <CheckIcon
                sx={{
                  color: '#fff',
                  filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))',
                }}
              />
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

export default ColorSelector;
