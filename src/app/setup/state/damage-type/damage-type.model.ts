export enum DamageTypeType {
  DamageType = 0,
  Effect = 1
}

export interface DamageType {
  id: string;
  owner: string;
  name: string;
  color: string;
  type: DamageTypeType;
}

export function createDamageType(params: Partial<DamageType>) {
  return {

  } as DamageType;
}
