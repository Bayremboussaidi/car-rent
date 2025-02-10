export interface Voiture {
  id?: number;
  carName: string;
  brand: string;
  category: string;
  transmission: string;
  toit: string;
  carburant: string;
  price: number;
  featured: boolean;
  agence: string;
  local: string;
  agenceLogo: string;
  description: string;
  imgUrl?: string; // Base64 encoded image string
  disponible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  reviews?: Review[];
  photos?: Photo[];
  bookings?: Booking[];
}



export interface Review {
  id?: number;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export interface Photo {
  id?: number;
  data: string; // Base64 encoded string
}

export interface Booking {
  id?: number;
  startDate: Date;
  endDate: Date;
}
