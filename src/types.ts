export interface Suite {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  type: 'standard' | 'deluxe' | 'executive' | 'penthouse';
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  images: string[];
  beds: string;
  guests: number;
  size: number; // in sq ft
  amenities: string[];
  featured: boolean;
}

export interface Booking {
  id: string;
  suiteId: string;
  suiteName: string;
  suiteImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalPrice: number;
  nights: number;
  status: 'active' | 'cancelled';
  bookingDate: string;
  specialRequests?: string;
}

export interface Review {
  id: string;
  suiteId: string;
  userName: string;
  userId?: string;
  rating: number;
  date: string;
  comment: string;
  title?: string;
}

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  memberSince: string;
  memberId: string;
  preferences: {
    roomTemperature: number; // in Celsius
    pillowType: 'Goose Down' | 'Memory Foam' | 'Hypoallergenic' | 'Lavender Infused';
    roomLocation: 'High Floor' | 'Near Elevator' | 'Quiet Courtyard' | 'No Preference';
  };
}

