export interface User {
  id?: number; // Ensure it's always a number
  username?: string;
  firstName?: string; // Required for Keycloak
  lastName?: string; // Required for Keycloak
  email?: string;
  password?: string;
  phone?: number;
  workplace?: string | null;
  photo?: string;
  role?: 'ADMIN' | 'USER' | 'AGENCE'; // Match Java enum
  createdAt?: string;
  updatedAt?: string;
  anonymous?: boolean;
  bearer?: string; // Only for front-end authentication
}
