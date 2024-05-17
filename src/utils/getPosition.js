function getPosition(pixel) {
  return {
    x: pixel.position.x + parseInt(process.env.X_OFFSET),
    y: pixel.position.y + parseInt(process.env.Y_OFFSET)
  };
}

module.exports = getPosition;
