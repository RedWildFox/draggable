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
      delay: 20,
    mirror: {
      appendTo: containerSelector,
      constrainDimensionsWidth: true,
    },
      indent: 60,
      maxLevel: 2,
  });

  return nested;
}
