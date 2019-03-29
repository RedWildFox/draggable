import Sortable from '../Sortable';
import {} from './NestedEvent';

export default class Nested extends Sortable {
  constructor(containers = [], options = {}) {
    super(containers, {
      ...options,
      announcements: {
        ...(options.announcements || {}),
      },
    });
  }
}
