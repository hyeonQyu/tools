import { pxToRem } from '@/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

interface GoalsSectionProps {
  title: string;
  items: Array<{ id: string; checked: boolean; name: string }>;
  onToggleCompleted?: (id: string) => void | Promise<void>;
  unfoldable?: boolean;
}

function GoalsSection({ title, items, onToggleCompleted, unfoldable = false }: GoalsSectionProps) {
  return (
    <Accordion
      defaultExpanded
      disableGutters
      disabled={unfoldable}
      elevation={0}
      square
      sx={{
        p: 1,
        '&::before': { display: 'none' },
        '&.Mui-disabled': { backgroundColor: 'transparent' },
        '&.Mui-disabled .MuiAccordionSummary-root': { opacity: 1 },
      }}
    >
      <AccordionSummary
        expandIcon={!unfoldable ? <ExpandMoreIcon fontSize="small" /> : null}
        sx={{
          minHeight: 0,
          px: 2,
          py: 0.5,
          pointerEvents: !unfoldable ? 'auto' : 'none',
          '& .MuiAccordionSummary-content': { my: 0.5 },
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
          {title}
          <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 1 }}>
            {items.length}
          </Typography>
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        <List dense>
          {items.length === 0 ? (
            <ListItem sx={{ px: 2 }}>
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.disabled">
                    항목이 없습니다.
                  </Typography>
                }
              />
            </ListItem>
          ) : (
            items.map(({ id, name, checked }) => {
              const checkboxId = `goal-checkbox-${id}`;

              return (
                <ListItem key={id} disablePadding sx={{ px: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox
                      id={checkboxId}
                      size="medium"
                      checked={checked}
                      disableRipple
                      sx={{ p: 0.5 }}
                      onChange={() => onToggleCompleted?.(id)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        component="label"
                        htmlFor={checkboxId}
                        variant="body2"
                        sx={{
                          textDecoration: checked ? 'line-through' : 'none',
                          color: checked ? 'text.disabled' : 'text.primary',
                          fontSize: pxToRem(14),
                          cursor: 'pointer',
                        }}
                      >
                        {name}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })
          )}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

export default GoalsSection;
