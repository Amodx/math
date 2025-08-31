import { Vector3Like } from "../../Abstract/Vectors/Vector3Like";

export interface BoundsMinMaxData {
  min: Vector3Like;
  max: Vector3Like;
}

export interface BoundsInterface {
  intersectsPoint(point: Vector3Like): boolean;
  intersectsMinMax(min: Vector3Like, max: Vector3Like): boolean;
  rayIntersection(
    rayOrigin: Vector3Like,
    rayDirection: Vector3Like,
    length: number
  ): number;
  getMinMax(): BoundsMinMaxData;
}
