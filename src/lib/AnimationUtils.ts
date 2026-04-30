/**
 * V for Vertex
 */
class V {
  // graph node A.K.A. Vertex
  x: number;
  y: number;
  z: number;
  object: any;
  constructor(x: number, y: number, z: number, object: any) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.object = object;
  }
}

/**
 * Animation Utilities - TODO use service instead...
 */
class AnimationUtils {
  getDistance(p1: V, p2: V, p3: V) {
    const radius = Math.sqrt(
      Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2),
    );
    return radius;
  }

  randIntRange(min: number, max: number, roundTo?: number): number {
    let val = Math.round(Math.random() * (max - min) + min);
    if (roundTo !== undefined) {
      val = Math.round(val / roundTo) * roundTo;
    }
    return val;
  }

  shuffleArray(inArray: any[]) {
    let i = inArray.length;
    let j;
    let temp;

    if (i === 0) {
      return false;
    }

    while (--i) {
      j = Math.floor(Math.random() * (i + 1));
      temp = inArray[i];
      inArray[i] = inArray[j];
      inArray[j] = temp;
    }
    return inArray;
  }

  clamp(number: number, min: number, max: number): number {
    return Math.min(Math.max(number, min), max);
  }

  randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  radians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  degrees(radians: number) {
    return radians * (180 / Math.PI);
  }

  /**
   * @see https://stackoverflow.com/a/15048260
   */
  randomSpherePoint(x0: number, y0: number, z0: number, radius: number) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const x = x0 + radius * Math.sin(phi) * Math.cos(theta);
    const y = y0 + radius * Math.sin(phi) * Math.sin(theta);
    const z = z0 + radius * Math.cos(phi);
    return [x, y, z];
  }
}

export default AnimationUtils;
