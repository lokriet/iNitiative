import { ParticipantType } from 'src/app/setup/state/participants/participant.model';

export interface EncounterParticipant {
  id: string;
  owner: string;
  type: ParticipantType;
  color: string;
  name: string;
  initiative: number;
  initiativeModifier: number;
  currentHp: number;
  maxHp: number;
  temporaryHp: number;
  armorClass: number;
  speed: number;
  vulnerabilityIds: string[];
  immunityIds: string[];
  resistanceIds: string[];
  conditionIds: string[];
  comments: string;
}

export function createEncounterParticipant(params: Partial<EncounterParticipant>) {
  return {

  } as EncounterParticipant;
}
