import { ParticipantType } from 'src/app/setup/state/participants/participant.model';

export interface EncounterParticipant {
  id: string;
  owner: string;
  type: ParticipantType;
  name: string;
  initiative: number;
  initiativeModifier: number;
  currenthp: number;
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
