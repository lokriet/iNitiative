export interface Condition {
  id: string;
  owner: string;
  name: string;
  color: string;
  description: string;
}

export function createCondition(params: Partial<Condition>) {
  return {

  } as Condition;
}
