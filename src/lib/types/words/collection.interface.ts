export interface ICollection {
  collectionId: string;
  collectionName: string;
  learntWordIDs: string[];
}

export interface IDeleteCollectionRequest
  extends Omit<ICollection, "collectionName" | "learntWordIDs"> {}

export interface IAddWordToCollectionRequest {
  wordId: string;
  collectionId: string;
}

export interface IAddWordToCollectionRequest {
  wordId: string;
  collectionId: string;
}
