export type LandmarkPoint = {
  x: number;
  y: number;
};

export interface HandLandmarks {
  wrist: LandmarkPoint;
  thumb: {
    cmc: LandmarkPoint;
    mcp: LandmarkPoint;
    ip: LandmarkPoint;
    tip: LandmarkPoint;
  };
  index: {
    mcp: LandmarkPoint;
    pip: LandmarkPoint;
    dip: LandmarkPoint;
    tip: LandmarkPoint;
  };
  middle: {
    mcp: LandmarkPoint;
    pip: LandmarkPoint;
    dip: LandmarkPoint;
    tip: LandmarkPoint;
  };
  ring: {
    mcp: LandmarkPoint;
    pip: LandmarkPoint;
    dip: LandmarkPoint;
    tip: LandmarkPoint;
  };
  pinky: {
    mcp: LandmarkPoint;
    pip: LandmarkPoint;
    dip: LandmarkPoint;
    tip: LandmarkPoint;
  };
}

export function transformPoints({ x, y }: LandmarkPoint): LandmarkPoint {
  return {
    x: 1 - x,
    y
  };
}

export function parseLandmarks(points: LandmarkPoint[]): HandLandmarks {
  if (points.length !== 21) {
    throw new Error(`parseLandmarks expected 21 points, got ${points.length}`);
  }
  return {
    wrist: transformPoints(points[0]),
    thumb: {
      cmc: transformPoints(points[1]),
      mcp: transformPoints(points[2]),
      ip: transformPoints(points[3]),
      tip: transformPoints(points[4])
    },
    index: {
      mcp: transformPoints(points[5]),
      pip: transformPoints(points[6]),
      dip: transformPoints(points[7]),
      tip: transformPoints(points[8])
    },
    middle: {
      mcp: transformPoints(points[9]),
      pip: transformPoints(points[10]),
      dip: transformPoints(points[11]),
      tip: transformPoints(points[12])
    },
    ring: {
      mcp: transformPoints(points[13]),
      pip: transformPoints(points[14]),
      dip: transformPoints(points[15]),
      tip: transformPoints(points[16])
    },
    pinky: {
      mcp: transformPoints(points[17]),
      pip: transformPoints(points[18]),
      dip: transformPoints(points[19]),
      tip: transformPoints(points[20])
    }
  };
}

export function parseLandmarksArray(
  landmarks: LandmarkPoint[][]
): HandLandmarks[] {
  return landmarks.map((landmark) => parseLandmarks(landmark));
}
