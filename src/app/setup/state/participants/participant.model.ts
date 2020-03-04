export enum ParticipantType {
  Player = 0,
  Monster = 1
}

export interface Participant {
  id: string;
  owner: string;
  name: string;
  type: ParticipantType;
  avatarUrl: string;
  color: string;
  initiativeModifier: number;
  maxHp: number;
  armorClass: number;
  speed: number;
  swimSpeed: number;
  climbSpeed: number;
  flySpeed: number;
  vulnerabilityIds: string[];
  resistanceIds: string[];
  immunityIds: string[];
  featureIds: string[];
  comments: string;
  mapSizeX: number;
  mapSizeY: number;
}

export function createParticipant(params: Partial<Participant>) {
  return {

  } as Participant;
}
