import { Image } from "./products";

export interface BannerAndPopUp {
  id: number;
  documentId: string;
  Title: string;
  Url: string;
  ButtonText: string;
  Image: Image;
  Active: boolean;
}
