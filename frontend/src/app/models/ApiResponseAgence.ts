import { Review } from "./review.model";

export interface ApiResponseAgence {
  success: boolean;
  message: string;
  data: Voiture[];
}




export interface AgenceResponse {
  id: number;
  agencyName: string;
  email: string;
  phoneNumber: string;
  city: string;
  photo: string;  // This could be a URL or base64 string
}



export interface Voiture {
  id: number;
  carName: string;
  brand: string;
  category: string;
  transmission: string;
  toit: string;
  carburant: string;
  price: number;
  disponible: boolean;
  agence: string;
  local: string;
  createdAt: string;
  updatedAt: string;
  images: CarImage[];
  reviews?: Review[];
  rating?: number;
}

interface CarImage {
  id: number;
  type: string;
  base64Data: string;
}
