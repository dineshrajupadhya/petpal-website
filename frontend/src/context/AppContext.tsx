import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  description: string;
  image: string;
  price?: number;
  adoptionFee?: number;
  vaccinated: boolean;
  location: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  brand: string;
  rating: number;
  inStock: boolean;
}

interface Disease {
  id: string;
  name: string;
  species: string[];
  symptoms: string[];
  description: string;
  treatment: string;
  prevention: string;
  severity: 'mild' | 'moderate' | 'severe';
}

interface CartItem {
  id: string;
  type: 'product' | 'pet';
  quantity: number;
  item: Product | Pet;
}

interface AppState {
  user: User | null;
  pets: Pet[];
  products: Product[];
  diseases: Disease[];
  cart: CartItem[];
  wishlist: string[];
  chatMessages: Array<{
    id: string;
    sender: 'user' | 'bot' | 'admin';
    message: string;
    timestamp: Date;
  }>;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'ADD_TO_WISHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { sender: 'user' | 'bot' | 'admin'; message: string } };

const initialState: AppState = {
  user: null,
  pets: [],
  products: [],
  diseases: [],
  cart: [],
  wishlist: [],
  chatMessages: []
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'ADD_TO_WISHLIST':
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(id => id !== action.payload) };
    case 'ADD_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, {
          id: Date.now().toString(),
          sender: action.payload.sender,
          message: action.payload.message,
          timestamp: new Date()
        }]
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}