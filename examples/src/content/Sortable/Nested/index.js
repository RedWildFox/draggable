// eslint-disable-next-line import/no-unresolved
import {Nested} from '@shopify/draggable';

export default function SimpleList() {
  const containerSelector = '#Nested .NestedList';
  const containers = document.querySelectorAll(containerSelector);

  if (containers.length === 0) {
    return false;
  }

  // console.log(containers);

  const nested = new Nested(containers, {
    draggable: '.StackedListItem--isDraggable',
    mirror: {
      appendTo: containerSelector,
      constrainDimensions: true,
    },
  });

  return nested;
}
