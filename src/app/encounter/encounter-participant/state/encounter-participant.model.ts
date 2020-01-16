import { ParticipantType } from 'src/app/setup/state/participants/participant.model';

export interface EncounterParticipant {
  id: string;
  owner: string;
  type: ParticipantType;
  color: string;
  avatarUrl: string;
  name: string;
  initiative: number;
  initiativeModifier: number;
  currentHp: number;
  maxHp: number;
  temporaryHp: number;
  armorClass: number;
  temporaryArmorClass: number;
  speed: number;
  temporarySpeed: number;
  vulnerabilityIds: string[];
  immunityIds: string[];
  resistanceIds: string[];
  featureIds: string[];
  conditionIds: string[];
  comments: string;
  advantages: string;
  mapSizeX: number;
  mapSizeY: number;
}

export function createEncounterParticipant(params: Partial<EncounterParticipant>) {
  return {

  } as EncounterParticipant;
}
