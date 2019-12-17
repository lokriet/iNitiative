export interface Feature {
  id: string;
  owner: string;
  name: string;
  color: string;
  description: string;
}

export function createFeature(params: Partial<Feature>) {
  return {

  } as Feature;
}
