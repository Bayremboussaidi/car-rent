export interface User {
  id?: number; // Keycloak may not return an ID
  username?: string; // Keycloak may not have a username field
  email?: string;
  password?: string;
  photo?: string;
  role?: 'ADMIN' | 'USER' | 'AGENCE'; // Role extracted from Keycloak token
  phone?: number;
  workplace?: string | null;
  createdAt?: string; // These might not be available in Keycloak
  updatedAt?: string;
  anonymous: boolean; // Flag to determine anonymous state
  bearer?: string; // Token storage
}
