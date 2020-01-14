export interface Encounter {
  id: string;
  owner: string;
  name: string;
  participantIds: string[];
  createdDate: number;
  lastModifiedDate: number;
  activeParticipantId: string;
  mapId: string;
}

export function createEncounter(params: Partial<Encounter>) {
  return {

  } as Encounter;
}
