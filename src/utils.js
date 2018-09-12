// helper functions, it turned out chrome doesn't support Math.sgn()
export const signum = x => (x < 0 ? -1 : 1);
export const absolute = x => (x < 0 ? -x : x);

export const drawPath = (svg, path, startX, startY, endX, endY) => {
  // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)

  const stroke = parseFloat(path.getAttribute('stroke-width'));

  const deltaX = endX - startX;
  const tension = deltaX * -0.225;

  const midX = (endX + startX) / 2;
  const midY = (endY + startY) / 2;

  let mid1X = ((midX + startX) / 2) + tension;
  const mid1Y = (midY + startY) / 2;

  let mid2X = ((endX + midX) / 2) - tension;
  const mid2Y = (endY + midY) / 2;

  // for further calculations which ever is the shortest distance
  const delta = midY < absolute(midX) ? midY : absolute(midX);

  // set sweep-flag (counter/clock-wise)
  // if start element is closer to the left edge,
  // draw the first arc counter-clockwise, and the second one clock-wise
  let arc1 = 0;
  let arc2 = 1;
  if (startX > endX) {
    arc1 = 1;
    arc2 = 0;
  }

  let svgPath = `M${startX} ${startY} C ${mid1X} ${mid1Y}, ${mid1X} ${mid1Y}, ${midX} ${midY} C ${mid2X} ${mid2Y}, ${mid2X} ${mid2Y}, ${endX} ${endY}`;

  if (endX === startX) {
    svgPath = `M${startX} ${startY} L ${endX} ${endY}`;
  }

  // draw tha pipe-like path
  // 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end
  path.setAttribute(
    'd',
    svgPath
  );
};

export const connectElements = (container, svg, path, startElem, endElem) => {
  // if first element is lower than the second, swap!
  if (
    startElem.getBoundingClientRect().top > endElem.getBoundingClientRect().top
  ) {
    const temp = startElem;
    startElem = endElem;
    endElem = temp;
  }

  // get (top, left) corner coordinates of the svg container
  const svgTop = container.getBoundingClientRect().top;
  const svgLeft = container.getBoundingClientRect().left;

  // get (top, left) coordinates for the two elements
  const startCoord = startElem.getBoundingClientRect();
  const endCoord = endElem.getBoundingClientRect();

  // calculate path's start (x,y)  coords
  // we want the x coordinate to visually result in the element's mid point
  const startX = startCoord.left + 0.5 * startCoord.width - svgLeft; // x = left offset + 0.5*width - svg's left offset
  const startY = startCoord.top + startCoord.height - svgTop; // y = top offset + height - svg's top offset

  // calculate path's end (x,y) coords
  const endX = endCoord.left + 0.5 * endCoord.width - svgLeft;

  const endY = endCoord.top - svgTop;

  // call function for drawing the path
  drawPath(svg, path, startX, startY, endX, endY);
};
