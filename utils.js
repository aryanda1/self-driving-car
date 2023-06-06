// Linear interpolatin from a to b by t like using the python range function
function lerp(a, b, t) {
  return a + (b - a) * t;
}

//THe explanation of the intersection function is done in a project in the same directory as this one
function intersection(A, B, C, D) {
  const uTop = (A.x - C.x) * (B.y - A.y) - (B.x - A.x) * (A.y - C.y);
  const tTop = (D.y - C.y) * (A.x - C.x) - (D.x - C.x) * (A.y - C.y);
  const bottom = (B.y - A.y) * (D.x - C.x) - (B.x - A.x) * (D.y - C.y);
  if (bottom != 0) {
    const u = uTop / bottom;
    const t = tTop / bottom;
    if (0 <= u && u <= 1 && 0 <= t && t <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }
  return null;
}
