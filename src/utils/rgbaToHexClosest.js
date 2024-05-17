function rgbaToHexClosest(rgba, hexColors) {
  const rgbaArray = [rgba.r, rgba.g, rgba.b, rgba.a];
  let minDistance = Number.MAX_VALUE;
  let closestColor = null;

  hexColors.forEach(hex => {
    const color = hexToRgb(hex);
    const colorArray = [color.r, color.g, color.b, color.a];
    const distance = Math.sqrt(
      rgbaArray.reduce((acc, val, i) => acc + (val - colorArray[i]) ** 2, 0)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = hex;
    }
  });
  return closestColor;
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b, a: 1 };
}

module.exports = rgbaToHexClosest;
