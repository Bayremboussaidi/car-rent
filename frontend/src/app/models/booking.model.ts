export interface Booking {
  id: number;
  userId: number;
  username: string;
  carName: string;
  userEmail: string;
  nbrJrs: number;
  phone: string;
  description: string;
  startDate:  Date | string;
  endDate:  Date | string;
  status: string;
  pickupLocation: string;
  dropoffLocation: string;
  formattedDate?: string; //  Add this to avoid TypeScript errors
  price?: number;
}

