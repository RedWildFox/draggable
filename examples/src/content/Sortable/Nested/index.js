// eslint-disable-next-line import/no-unresolved
import {Nested} from '@shopify/draggable';

export default function SimpleList() {
  const containerSelector = '.NestedList';
  const containers = document.querySelectorAll(containerSelector);

  if (containers.length === 0) {
    return false;
  }

  console.log({
      containerSelector,
      containers
  });

  // console.log(containers);

  const nested = new Nested(containers, {
    draggable: '.StackedListItem--isDraggable',
      indent: 60,
      maxLevel: 2,
      handle: '.DragHandle',
      mirror: {
          appendTo: containerSelector,
          constrainDimensions: true,
      },
  });

    nested.on('nested:stop', (event) => console.log(event));

  return nested;
}
