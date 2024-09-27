export interface ICollection {
  _id: string;
  collectionName: string;
  words: string[];
}

export interface IDeleteCollectionRequest {
  collectionId: string;
}

export interface IAddWordToCollectionRequest {
  wordId: string;
  collectionId: string;
}

export interface IAddWordToCollectionRequest {
  wordId: string;
  collectionId: string;
}
