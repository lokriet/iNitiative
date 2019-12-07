export enum ParticipantType {
  Player = 0,
  Monster = 1
}

export interface Participant {
  id: string;
  owner: string;
  name: string;
  type: ParticipantType;
  color: string;
  initiativeModifier: number;
  maxHp: number;
  armorClass: number;
  speed: number;
  vulnerabilityIds: string[];
  resistanceIds: string[];
  immunityIds: string[];
  comments: string;
}

export function createParticipant(params: Partial<Participant>) {
  return {

  } as Participant;
}
