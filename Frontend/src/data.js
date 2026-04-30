export const PRODUCTS = [
  {
    id: '1',
    name: 'Organic Heritage Tomatoes',
    price: 30,
    unit: 'kg',
    farmer: 'Farmer Amit',
    location: 'Nashik (2km away)',
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1576982832772-9dc1779033a5?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Veggies',
    farmerImage: 'https://i.pravatar.cc/150?u=amit',
    organic: true,
    pesticideFree: true
  },
  {
    id: '2',
    name: 'Alphonso Mangoes',
    price: 80,
    unit: 'dozen',
    farmer: 'Farmer Maria',
    location: 'Ratnagiri (10km away)',
    rating: 5.0,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800',
    category: 'Fruits',
    farmerImage: 'https://i.pravatar.cc/150?u=maria',
    organic: true,
    pesticideFree: true
  },
  {
    id: '3',
    name: 'Premium Basmati Rice',
    price: 40,
    unit: 'kg',
    farmer: 'Farmer David',
    location: 'Punjab (45km away)',
    rating: 4.8,
    reviews: 850,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    category: 'Grains',
    farmerImage: 'https://i.pravatar.cc/150?u=david',
    organic: true,
    pesticideFree: false
  },
  {
    id: '4',
    name: 'Organic Baby Spinach',
    price: 80,
    unit: 'bunch',
    farmer: 'Farmer Amit',
    location: 'Nashik (2km away)',
    rating: 4.7,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800',
    category: 'Veggies',
    farmerImage: 'https://i.pravatar.cc/150?u=amit',
    organic: true,
    pesticideFree: true
  }
];

export const FARMERS = [
  {
    id: 'f1',
    name: 'Farmer David',
    experience: '15 years',
    specialty: 'Root vegetables and rare herbs',
    rating: 4.9,
    reviews: 850,
    bio: 'Dedicated to soil health and regenerative practices. My farm in Punjab has been organic-certified since 2012.',
    image: 'https://plus.unsplash.com/premium_photo-1661411325413-98a5ff88e8e4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFybWVyfGVufDB8fDB8fHww',
    banner: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    verifiedSince: '2021'
  }
];

export const CATEGORIES = [
  { name: 'Fruits', icon: '🍎' },
  { name: 'Veggies', icon: '🥕' },
  { name: 'Grains', icon: '🌾' },
  { name: 'Spices', icon: '🌶️' },
  { name: 'Organic', icon: '🏷️' }
];
