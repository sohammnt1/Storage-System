export interface IChanges {
  status: string;
  requestedMaxNumberOfFiles?: number;
  requestedMaxSizeOfFiles?: number;
  email: string;
}

export interface IFilter {
  totalFiles: number;
  totalSize: number;
}
