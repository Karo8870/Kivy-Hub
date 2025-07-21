const M = new Float32Array([
  1.845646, 0.211545, -826.128338, 0.073045, 1.929235, -217.090013, 0.0,
  0.00027, 1.0
]);

const width = 1920;
const height = 1200;

export function transformCoordinates(x: number, y: number) {
  const point = [x, y, 1];

  const transformedX = M[0] * point[0] + M[1] * point[1] + M[2] * point[2];
  const transformedY = M[3] * point[0] + M[4] * point[1] + M[5] * point[2];
  const transformedW = M[6] * point[0] + M[7] * point[1] + M[8] * point[2];

  let newX = transformedX / transformedW;
  let newY = transformedY / transformedW;

  newX = Math.min(Math.max(0, newX), width - 1);
  newY = Math.min(Math.max(0, newY), height - 1);

  return [newX, newY];
}
