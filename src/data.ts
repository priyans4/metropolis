import { Suite, Review } from './types';

export const INITIAL_SUITES: Suite[] = [
  {
    id: 's1',
    name: 'Cosmopolitan Queen Suite',
    description: 'An elegant, cozy retreat featuring high ceilings, contemporary styling, and premium bedding. Perfect for couples or business travelers.',
    longDescription: 'Our Cosmopolitan Queen Suite offers a refined urban sanctuary in the heart of the city. Featuring custom-designed furnishings, a plush queen-sized bed with Egyptian cotton linens, a dedicated workspace, and a spa-inspired marble bathroom. Floor-to-ceiling windows wash the room in natural light and offer peaceful courtyard views.',
    type: 'standard',
    pricePerNight: 185,
    rating: 4.4,
    reviewCount: 42,
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    beds: '1 Queen Bed',
    guests: 2,
    size: 380,
    amenities: ['Free Wi-Fi', 'Smart TV', 'Nespresso Machine', 'Mini Fridge', 'Rain Shower', 'Workspace'],
    featured: false
  },
  {
    id: 's2',
    name: 'Metropolitan King Suite',
    description: 'A spacious urban suite with a king-sized bed, stunning skyline views, and a sophisticated lounge corner.',
    longDescription: 'Elevate your city stay in our Metropolitan King Suite. Crafted with custom brass fixtures, rich oak detailing, and beautiful designer lighting, it features an ultra-premium King-sized mattress, a dedicated seating lounge, an honors minibar, and a gorgeous rainfall shower with organic luxury bath amenities.',
    type: 'deluxe',
    pricePerNight: 275,
    rating: 4.7,
    reviewCount: 56,
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
    ],
    beds: '1 King Bed',
    guests: 2,
    size: 480,
    amenities: ['Free Wi-Fi', 'Smart TV', 'Nespresso Machine', 'Premium Minibar', 'Rain Shower', 'City View', 'Lounge Area'],
    featured: true
  },
  {
    id: 's3',
    name: 'Terrace Junior Suite',
    description: 'Features a private landscaped terrace overlooking the historic district, sun lounger, and comfortable work desk.',
    longDescription: 'Immerse yourself in fresh air and urban sights on your own private, landscaped brick terrace. Inside, enjoy a cozy living alcove, a premium King bed, and an executive writing table. The marble bathroom boasts a deep soaking tub and a walk-in steam shower.',
    type: 'deluxe',
    pricePerNight: 340,
    rating: 4.5,
    reviewCount: 29,
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596598045551-2aa063713f56?auto=format&fit=crop&w=1200&q=80'
    ],
    beds: '1 King Bed',
    guests: 2,
    size: 510,
    amenities: ['Free Wi-Fi', 'Smart TV', 'Private Terrace', 'Nespresso Machine', 'Soaking Tub', 'In-room Safe', 'Plush Robes'],
    featured: false
  },
  {
    id: 's4',
    name: 'Skyline Executive Suite',
    description: 'An expansive mid-level executive retreat offering sweeping panoramic city views, separate lounge, and high-tech amenities.',
    longDescription: 'Designed for the modern connoisseur, this high-rise suite boasts sweeping panoramic views of the city skyline through full glass facades. It features a spacious separate living room, an executive wet-bar, a dining area, and a king bedroom. Access to our private Executive Club Lounge with free breakfast, evening drinks, and high tea is included.',
    type: 'executive',
    pricePerNight: 490,
    rating: 4.9,
    reviewCount: 38,
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80'
    ],
    beds: '1 King Bed & 1 Sofa Bed',
    guests: 3,
    size: 720,
    amenities: ['Free Wi-Fi', 'Smart TV', 'Executive Lounge Access', 'Kitchenette', 'Panoramic City View', 'Soaking Tub', 'Premium Audio'],
    featured: true
  },
  {
    id: 's5',
    name: 'Sanctuary Spa & Wellness Suite',
    description: 'Our ultimate wellness suite containing an in-room Finnish sauna, high-tech massage chair, and wellness aromatherapy dispenser.',
    longDescription: 'Prioritize your well-being in our curated Wellness Sanctuary. This unique suite includes a personal Finnish cedar-wood sauna, a professional massage chair, custom aromatherapy controls, circadian rhythm light therapy, and a spacious bathroom with a double-ended freestanding copper jacuzzi tub.',
    type: 'executive',
    pricePerNight: 580,
    rating: 4.8,
    reviewCount: 17,
    images: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
    ],
    beds: '1 King Bed',
    guests: 2,
    size: 650,
    amenities: ['Free Wi-Fi', 'Smart TV', 'In-room Sauna', 'Jacuzzi', 'Aromatherapy Unit', 'Fitness Equipment', 'Nutritional Minibar'],
    featured: false
  },
  {
    id: 's6',
    name: 'Grand Metropolis Penthouse',
    description: 'The pinnacle of luxury. A magnificent top-floor suite featuring 2 king bedrooms, private rooftop infinity plunge pool, and butler service.',
    longDescription: 'Hovering above the metropolis on the 32nd floor, our crown jewel penthouse offers unparalleled prestige and privacy. Comprising two palatial bedrooms, an expansive formal living and dining salon, a private pantry kitchen, a custom billiard table, and a secure private lift. Step onto the wrapping terrace to discover your private heated infinity plunge pool looking over the city landmarks.',
    type: 'penthouse',
    pricePerNight: 1250,
    rating: 5.0,
    reviewCount: 12,
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    beds: '2 King Beds',
    guests: 4,
    size: 1650,
    amenities: ['Free Wi-Fi', 'Smart TV', 'Private Rooftop Pool', '24/7 Dedicated Butler', 'Full Kitchen', 'Airport Luxury Transfer', 'Executive Lounge Access'],
    featured: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    suiteId: 's1',
    userName: 'Eleanor Vance',
    rating: 5,
    date: '2026-05-14',
    title: 'Flawless stay!',
    comment: 'The Cosmopolitan Queen was exceptionally clean and comfortable. The bed was a dream, and the staff left a lovely handwritten welcome note. Located right near local restaurants.'
  },
  {
    id: 'r2',
    suiteId: 's1',
    userName: 'James K.',
    rating: 4,
    date: '2026-06-12',
    title: 'Charming but slightly compact',
    comment: 'Very quiet and elegant room. A bit smaller than expected but perfectly designed to maximize space. The rain shower was amazing!'
  },
  {
    id: 'r3',
    suiteId: 's2',
    userName: 'Sarah Jenkins',
    rating: 5,
    date: '2026-06-20',
    title: 'Incredible View and Decor',
    comment: 'The brass and wood finish is gorgeous. Waking up to the floor-to-ceiling views of the cityscape was unforgettable. Excellent espresso machine!'
  },
  {
    id: 'r4',
    suiteId: 's2',
    userName: 'Robert Chang',
    rating: 4,
    date: '2026-05-30',
    title: 'Splendid luxury',
    comment: 'Wonderful design and very comfortable seating lounge. Minibar options were top tier, although a bit on the expensive side. Service is 5-star!'
  },
  {
    id: 'r5',
    suiteId: 's3',
    userName: 'Camila Rodriguez',
    rating: 5,
    date: '2026-06-25',
    title: 'The Terrace is Everything',
    comment: 'Sitting out on the private brick terrace with a morning cup of coffee was the highlight of our trip. Beautiful plantings, deeply relaxing soaking tub. Highly recommend.'
  },
  {
    id: 'r6',
    suiteId: 's4',
    userName: 'David Miller',
    rating: 5,
    date: '2026-06-18',
    title: 'Perfect for business and leisure',
    comment: 'Executive club lounge access was highly worth it. Wonderful afternoon tea and a peaceful workspace. The suite itself has amazing panoramic views. Staff accommodated my late check-out seamlessly.'
  },
  {
    id: 'r7',
    suiteId: 's5',
    userName: 'Aria Thompson',
    rating: 5,
    date: '2026-06-28',
    title: 'Absolute Bliss!',
    comment: 'An in-room Finnish sauna is something I did not know I needed! The copper jacuzzi was spectacular and the massage chair melted away a week of stressful travel. Worth every penny!'
  },
  {
    id: 'r8',
    suiteId: 's6',
    userName: 'Christian Grey',
    rating: 5,
    date: '2026-06-02',
    title: 'Ultimate luxury with zero flaws',
    comment: 'Unbelievable rooftop plunge pool. Our personal butler Marcus anticipated every single need, from dinner bookings to premium wine. The design layout is magnificent.'
  },
  {
    id: 'r9',
    suiteId: 's3',
    userName: 'Marcus Aurelius',
    rating: 4,
    date: '2026-04-21',
    title: 'Peaceful garden escape',
    comment: 'Very serene terrace design. Excellent location away from the core traffic noise. The steam shower is incredible, though the desk chair could be slightly more ergonomic.'
  }
];

export const AMENITIES_LIST = [
  'Free Wi-Fi',
  'Smart TV',
  'Nespresso Machine',
  'Private Terrace',
  'City View',
  'Panoramic City View',
  'Private Rooftop Pool',
  'In-room Sauna',
  'Jacuzzi',
  'Soaking Tub',
  'Executive Lounge Access',
  'Rain Shower'
];
