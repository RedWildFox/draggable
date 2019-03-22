import Sortable from '../Sortable';
import {} from './MenuEvent';

export default class Menu extends Sortable {
  constructor(containers = [], options = {}) {
    super(containers, {
      ...options,
      announcements: {
        ...(options.announcements || {}),
      },
    });
  }
}
