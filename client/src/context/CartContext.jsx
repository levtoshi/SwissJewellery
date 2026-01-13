import { createContext, useContext, useReducer, useState, useEffect , useRef } from "react";
import { cartAPI } from "../api/cart";
import { useAuth } from "./AuthContext";
import useLocalStorageReducer from "../hooks/useLocalStorageReducer";
import toast from "react-hot-toast";

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0
}

const ADD_ITEM = "ADD_ITEM";
const REMOVE_ITEM = "REMOVE_ITEM";
const UPDATE_QUANTITY = "UPDATE_QUANTITY";
const CLEAR_CART = "CLEAR_CART";

const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_ITEM: {
      const existingItem = state.items.find( 
        (item) => item._id === action.payload._id
      );
            
      if (existingItem) {
        return {
          items: state.items.map((item) => 
            item._id === action.payload._id
            ? {...item, quantity: item.quantity + 1}
            : item
          ),
          total: state.total + (action.payload.finalPrice || action.payload.price)
        }
      }
      else {
        return {
          items: [...state.items, {...action.payload, quantity: 1}],
          total: state.total + (action.payload.finalPrice || action.payload.price)
        }
      }
    }

    case REMOVE_ITEM: {
      const item = state.items.find( (item) => item._id === action.payload);
      const itemPrice = item.finalPrice || item.price;
      return {
        items: state.items.filter( (item) => item._id !== action.payload),
        total: state.total - (itemPrice * item.quantity)
      };
    }

    case UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      const item = state.items.find( (item) => item._id === id);
      const itemPrice = item.finalPrice || item.price;
      const oldQuantity = item.quantity;
      const priceDiff = (quantity - oldQuantity) * itemPrice;

      return {
          items: state.items.map( (item) => 
          item._id === id ? {...item, quantity } : item
        ),
        total: state.total + priceDiff
      }
    }

    case CLEAR_CART: 
      return initialState;

    case 'SYNC_CART':
      const serverItems = action.payload.items || [];
      const localItems = serverItems.map(item => ({
        ...item.product,
        quantity: item.quantity
      }));
      
      const calculatedTotal = localItems.reduce((sum, item) => {
        const price = item.finalPrice || item.price || 0;
        return sum + (price * item.quantity);
      }, 0);
      
      return {
        items: localItems,
        total: calculatedTotal
      };
   
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const [state, dispatch] = useLocalStorageReducer("cart", cartReducer, initialState);

  useEffect(() => {
    if (!isAuthenticated)
    {
      dispatch({type: CLEAR_CART});
      return;
    }
    cartAPI.get().then(serverCart =>
    {
      dispatch({
        type: 'SYNC_CART',
        payload: { items: serverCart.items }
      });
    }).catch(err => toast.error(`Initial cart sync failed: ${err}`));
  }, [isAuthenticated]);


  const addItem = (item) => {
    const itemState = state.items?.find((i) => i._id === item._id);
    const currentQuantity = itemState?.quantity || 0;
    
    if (currentQuantity >= item.stock) {
      toast.error("Max stock!");
      return;
    }

    dispatch({type: ADD_ITEM, payload: item});
    if (isAuthenticated) {
      cartAPI.addItem({ productId: item._id, quantity: 1 })
        .then(() => {
          toast.success(`${item.name} added to cart!`);
        })
        .catch(error => {
          toast.error(`Failed to add item to server cart: ${error.message || error}`);
        });
    }
  }

  const removeItem = (id) => {
    dispatch({type: REMOVE_ITEM, payload: id});
    if (isAuthenticated) {
      cartAPI.removeItem(id).catch(error => {
        toast.error(`Failed to remove item from server cart: ${error}`);
      });
    }
  }

  const updateQuantity = (id, quantity) => {
    const item = state.items.find(i => i._id === id);
    
    if (quantity > item.stock) {
      toast.error("Max stock!");
      return;
    }

    dispatch({type: UPDATE_QUANTITY, payload: {id, quantity}});
    if (isAuthenticated) {
      cartAPI.updateItem(id, { quantity }).catch(error => {
        toast.error(`Cannot update product quantity: ${error}`);
      });
    }
  }

  const clearCart = () => {
    dispatch({type: CLEAR_CART});
    if (isAuthenticated) {
      cartAPI.clear().catch(error => {
        toast.error(`Failed to clear server cart: ${error}`);
      });
    }
  }

  const value = {
    items: state.items,
    total: state.total,
    itemCount: state.items?.reduce((sum, item) => sum + item.quantity, 0),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isCartOpen,
    toggleCart,
    openCart,
    closeCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};