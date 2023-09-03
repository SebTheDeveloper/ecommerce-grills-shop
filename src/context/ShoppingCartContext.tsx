import { ReactNode, createContext, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type AddOn = {
  name: string;
  price: number;
  isAdded: boolean;
};

type CartItem = {
  id: number;
  quantity: number;
  addOns: AddOn[];
};

type ShoppingCartContextType = {
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  getItemQuantity: (id: number) => number;
  getSelectedAddOns: (id: number) => AddOn[] | undefined;
  updateAddOns: (id: number, addOn: string) => AddOn[] | undefined;
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

const defaultAddOns: AddOn[] = [
  { name: "open-face", price: 30, isAdded: false },
  { name: "diamond-dust", price: 30, isAdded: false },
  { name: "chipped-tooth", price: 30, isAdded: false },
  { name: "missing-tooth", price: 50, isAdded: false },
];

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

  function getSelectedAddOns(id: number): AddOn[] | undefined {
    const addOns = cartItems.find((item) => item.id === id)?.addOns;
    return addOns?.filter((addOn) => addOn.isAdded);
  }

  function updateAddOns(id: number, addOn: string): AddOn[] | undefined {
    const addOns = cartItems.find((item) => item.id === id)?.addOns;
    if (!addOns) return undefined;
    const updatedAddOns = addOns.map((item) => {
      if (item.name === addOn) {
        return { ...item, isAdded: !item.isAdded };
      }
      return item;
    });

    setCartItems((currItems) => {
      return currItems.map((item) => {
        if (item.id === id) {
          return { ...item, addOns: updatedAddOns };
        } else return item;
      });
    });
  }

  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1, addOns: defaultAddOns }];
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
                item.addOns = [];
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
        return [
          ...currItems,
          { id, quantity: newQuantity, addOns: defaultAddOns },
        ];
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

  function removeFromCart(id: number): void {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        getSelectedAddOns,
        updateAddOns,
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
