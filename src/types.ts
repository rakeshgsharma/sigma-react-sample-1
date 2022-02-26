export interface NodeData {
  key: string;
  label: string;
  tag: string;
  URL: string;
  cluster: string;
  x: number;
  y: number;
}

export interface Cluster {
  key: string;
  color: string;
  clusterLabel: string;
}

export interface Tag {
  key: string;
  image: string;
}

export interface Dataset {
  jobs: any[];
  edge: [string, string][];
  clusters: Cluster[];
  tags: Tag[];
}

export interface CriticalPathDataset {
  vertex: any[];
  edge: [string, string][] | any;
  clusters: Cluster[];
  tags: Tag[];
  jobs: any[];
}

export interface FiltersState {
  clusters: Record<string, boolean>;
  tags: Record<string, boolean>;
}
