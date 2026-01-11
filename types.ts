
export interface ArchiveItem {
  id: string;
  url: string;
  title: string;
  year: number | string;
  tags: string[];
}

export interface ManifestEntry {
  path: string;
  data: {
    Title?: string;
    Year?: number | string;
    Tags?: string[];
  };
}
