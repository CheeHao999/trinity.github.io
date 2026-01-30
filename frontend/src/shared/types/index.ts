export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LostItem {
  id: string;
  name: string;
  category?: string;
  color?: string;
  description: string;
  location: string;
  lostDate: string;
  date?: string; // fallback
  contactInfo: string;
  imageUrl?: string;
  userId: string;
  createdAt: string;
  status: string;
  type?: string;
}

export interface FoundItem {
  id: string;
  name: string;
  category?: string;
  color?: string;
  description: string;
  location: string;
  foundDate: string;
  date?: string; // fallback
  contactInfo: string;
  imageUrl?: string;
  userId: string;
  matchedLostItemId?: string;
  createdAt: string;
  status: string;
  type?: string;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  message?: string;
  error?: string;
}
