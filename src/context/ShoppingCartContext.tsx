import { ReactNode, createContext, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
};

type ShoppingCartContextType = {
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  setCartQuantity: (id: number, newQuantity: number) => void;
  removeFromCart: (id: number) => void;
  toggleLoading: () => void;
  isLoading: boolean;
  cartQuantity: number;
  cartItems: CartItem[];
};

const ShoppingCartContext = createContext({} as ShoppingCartContextType);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const clearCart = () => setCartItems([]);

  const toggleLoading = () => setIsLoading(() => !isLoading);

  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            let newQuantity: 0 | 1 | 6 | 8 | 10;
            switch (item.quantity) {
              case 1:
                newQuantity = 6;
                break;
              case 6:
                newQuantity = 8;
                break;
              case 8:
                newQuantity = 10;
                break;
              case 10:
                newQuantity = 10;
                break;
              default:
                newQuantity = 1;
                console.log(
                  "Cart increment function encountered an error, item quantity set to 1"
                );
                break;
            }
            return { ...item, quantity: newQuantity };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            let newQuantity: 0 | 1 | 6 | 8 | 10;
            switch (item.quantity) {
              case 1:
                newQuantity = 0;
                break;
              case 6:
                newQuantity = 1;
                break;
              case 8:
                newQuantity = 6;
                break;
              case 10:
                newQuantity = 8;
                break;
              default:
                newQuantity = 0;
                console.log(
                  "Cart decrement function encountered an error, item quantity set to 0"
                );
                break;
            }
            return { ...item, quantity: newQuantity };
          } else {
            return item;
          }
        });
      }
    });
  }

  function setCartQuantity(id: number, newQuantity: number) {
    setCartItems((currItems) => {
      if (!currItems.find((item) => item.id === id)) {
        return [...currItems, { id, quantity: newQuantity }];
      }
      if (newQuantity === 0) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: newQuantity };
          } else return item;
        });
      }
    });
  }

  function removeFromCart(id: number) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        setCartQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
        openCart,
        closeCart,
        clearCart,
        toggleLoading,
        isLoading,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen}></ShoppingCart>
    </ShoppingCartContext.Provider>
  );
}
