export interface Metadata {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Page<T> {
  data: T[];
  meta: Metadata;
}

export type Token = {
  token: string;
  expire: string;
};

export type Tag = {
  id: string;
  name: string;
};

export interface CreateTag {
  name: string;
}

export interface GetTag {
  id: string;
  name: string;
}

export interface UpdateTag {
  fields?: {
    name?: string;
  };
}

export type Note = {
  id: string;
  title: string;
  file: string;
  text: string;
  tags: Tag[];
  lastUpdated: string;
};

export interface UpdateNote {
  text?: string;
  fields?: {
    title?: string;
    tags?: string[];
  };
  lastUpdated: string;
}

export type CreateNote = {
  title: string;
  text: string;
  tags: string[];
  lastUpdated: string;
};

export interface GetNote {
  id: string;
  title: string;
  file: string;
  text: string;
  tags: {
    _id: string;
    name: string;
  }[];
  lastUpdated: string;
}

export class NotFoundResponse {
  message: string;
  statusCode: number;
}
