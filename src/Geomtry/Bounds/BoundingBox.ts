import { Vector3Like } from "../../Abstract/Vectors/Vector3Like";
import { BoundsInterface, BoundsMinMaxData } from "./BoundsInterface";

export class BoundingBox implements BoundsInterface, BoundsMinMaxData {
  size = Vector3Like.Create();
  centroid = Vector3Like.Create();
  volume = 0;

  constructor(
    public min = Vector3Like.Create(),
    public max = Vector3Like.Create()
  ) {
    this.setMinMax(min, max);
  }

  setMinMax(min: Vector3Like, max: Vector3Like) {
    this.min.x = min.x;
    this.min.y = min.y;
    this.min.z = min.z;

    this.max.x = max.x;
    this.max.y = max.y;
    this.max.z = max.z;

    this.size.x = this.max.x - this.min.x;
    this.size.y = this.max.y - this.min.y;
    this.size.z = this.max.z - this.min.z;
    this._calculateVolume();
    this._calculateCentroid();
  }

  setSize(size: Vector3Like) {
    this.size.x = size.x;
    this.size.y = size.y;
    this.size.z = size.z;
    this._calculateVolume();
    this._updateMax();
    this._calculateCentroid();
  }

  setMinPositionAndSize(position: Vector3Like, size: Vector3Like) {
    this.min.x = position.x;
    this.min.y = position.y;
    this.min.z = position.z;
    this.size.x = size.x;
    this.size.y = size.y;
    this.size.z = size.z;
    this._calculateVolume();
    this._updateMax();
    this._calculateCentroid();
  }

  /**Sets the min position and then sets the max based off the size. */
  setMinPosition(position: Vector3Like) {
    this.min.x = position.x;
    this.min.y = position.y;
    this.min.z = position.z;
    this._updateMax();
    this._calculateCentroid();
  }

  intersectsPoint(point: Vector3Like): boolean {
    if (
      point.x < this.min.x ||
      point.y < this.min.y ||
      point.z < this.min.z ||
      point.x > this.max.x ||
      point.y > this.max.y ||
      point.z > this.max.z
    )
      return false;
    return true;
  }

  rayIntersectionFromWithin(
    origin: Vector3Like,
    direction: Vector3Like,
    length = Infinity
  ): number {
    let t = Infinity;
    if (direction.x > 0) t = Math.min(t, (this.max.x - origin.x) / direction.x);
    else if (direction.x < 0)
      t = Math.min(t, (this.min.x - origin.x) / direction.x);

    if (direction.y > 0) t = Math.min(t, (this.max.y - origin.y) / direction.y);
    else if (direction.y < 0)
      t = Math.min(t, (this.min.y - origin.y) / direction.y);

    if (direction.z > 0) t = Math.min(t, (this.max.z - origin.z) / direction.z);
    else if (direction.z < 0)
      t = Math.min(t, (this.min.z - origin.z) / direction.z);

    if (!isFinite(t) || t < 0 || t > length) return Infinity;
    return t;
  }
  
  rayIntersection(
    origin: Vector3Like,
    direction: Vector3Like,
    length = Infinity
  ): number {
    const keys = Vector3Like.Keys();
    let tmin = -Infinity;
    let tmax = Infinity;
    for (let i = 0; i < 3; i++) {
      const axis = keys[i];
      const o = origin[axis];
      const d = direction[axis];
      const mn = this.min[axis];
      const mx = this.max[axis];

      if (d === 0) {
        if (o < mn || o > mx) return Infinity;
        continue;
      }

      let t1 = (mn - o) / d;
      let t2 = (mx - o) / d;

      if (t1 > t2) {
        const tmp = t1;
        t1 = t2;
        t2 = tmp;
      }

      if (t1 > tmin) tmin = t1;
      if (t2 < tmax) tmax = t2;

      if (tmax < tmin) return Infinity;
    }

    if (tmax < 0) return Infinity;
    if (tmin >= 0) {
      if (tmin > length) return Infinity;
      return tmin;
    }
    return 0;
  }

  intersectsMinMax(min: Vector3Like, max: Vector3Like): boolean {
    if (this.max.x < min.x || this.min.x > max.x) return false;
    if (this.max.y < min.y || this.min.y > max.y) return false;
    if (this.max.z < min.z || this.min.z > max.z) return false;
    return true;
  }

  private _calculateCentroid() {
    this.centroid.x = (this.min.x + this.max.x) / 2;
    this.centroid.y = (this.min.y + this.max.y) / 2;
    this.centroid.z = (this.min.z + this.max.z) / 2;
  }

  private _updateMax() {
    this.max.x = this.min.x + this.size.x;
    this.max.y = this.min.y + this.size.y;
    this.max.z = this.min.z + this.size.z;
  }

  private _calculateVolume() {
    this.volume = this.size.x * this.size.y * this.size.z;
  }

  getMinMax(): BoundsMinMaxData {
    return this;
  }
}
