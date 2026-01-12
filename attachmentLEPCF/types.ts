export interface SharePointFile {
  Name: string;
  ServerRelativeUrl: string;
}

export interface SharePointFilesResponse {
  d: {
    results: SharePointFile[];
  };
}

export interface DocumentLocation {
  sharepointdocumentlocationid: string;
  relativeurl: string;
  _parentsiteorlocation_value: string;
}
