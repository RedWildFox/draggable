// eslint-disable-next-line import/no-unresolved
import {Sortable, Plugins} from '@shopify/draggable';

export default function SimpleList() {
  const containerSelector = '#SimpleList .StackedList';
  const containers = document.querySelectorAll(containerSelector);

  if (containers.length === 0) {
    return false;
  }

  const sortable = new Sortable(containers, {
    draggable: '.StackedListItem--isDraggable',
      classes: {
          'container:nested': 'StackedList',
      },
    mirror: {
      appendTo: containerSelector,
      constrainDimensions: true,
    },
      swapAnimation: {
          duration: 200,
          easingFunction: 'ease-in-out',
          horizontal: false
      },
      plugins: [Plugins.SwapAnimation]
  });

    // sortable.on('sortable:stop', (event) => console.log(event));

  return sortable;
}
