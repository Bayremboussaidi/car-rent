export interface User {
  id: number; // Unique identifier for the user
  username: string; // Username of the user
  email: string; // Email address of the user
  password?: string; // Password (optional, as it may not always be needed)
  photo?: string; // URL to the user's photo (optional)
  role: 'ADMIN' | 'USER'; // Role of the user (either ADMIN or USER)
  phone?: number; // Phone number of the user (optional)
  workplace?: string | null; // Workplace of the user (optional, can be null)
  createdAt: string; // Timestamp when the user was created
  updatedAt: string; // Timestamp when the user was last updated
}
