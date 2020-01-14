export interface Feature {
  id: string;
  owner: string;
  name: string;
  color: string;
  description: string;
  type: string;
}

export function createFeature(params: Partial<Feature>) {
  return {

  } as Feature;
}
