export interface Map {
  id: string;
  mapUrl: string;
  gridWidth: number;
  gridHeight: number;
  participantCoordinates: ParticipantCoordinate[];
}

export interface ParticipantCoordinate {
  participantId: string;
  x: number;
  y: number;
  infoX: number;
  infoY: number;
  gridX: string;
  gridY: string;
}

export function createMap(params: Partial<Map>) {
  return {

  } as Map;
}
