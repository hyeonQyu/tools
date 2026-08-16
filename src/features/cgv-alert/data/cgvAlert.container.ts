import { cgvNotificationRepository, cgvWatchRepository } from './repositories';
import { createCgvAlertService } from './services';

export const cgvAlertService = createCgvAlertService({ cgvWatchRepository, cgvNotificationRepository });
