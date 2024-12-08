import { ReactNode, createContext, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";
import storeItems from "../data/items.json";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

export type AddOn = {
  name: string;
  price: number;
  isAdded: boolean;
};

export type CartItem = {
  id: number;
  quantity: number;
  addOns: AddOn[];
};

export type ShoppingCartContextType = {
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  getItemQuantity: (id: number) => number;
  getAggregateItemQuantity: (id: number) => number;
  getMultiItem: (id: number) => CartItem[] | null;
  createMultiItem: (id: number) => void;
  getSelectedAddOns: (id: number) => AddOn[] | undefined;
  getAddOnTotal: () => number;
  updateAddOns: (id: number, addOn: string) => AddOn[] | undefined;
  increaseItemToothQuantity: (id: number) => void;
  decreaseItemToothQuantity: (id: number) => void;
  cartQuantity: number;
  setCartQuantity: (id: number, newQuantity: number) => void;
  removeFromCart: (id: number) => void;
  toggleLoading: () => void;
  isLoading: boolean;
  cartItems: CartItem[];
  termsAccepted: boolean;
  setTermsAccepted: (value: boolean) => void;
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
  const [termsAccepted, setTermsAccepted] = useState(false);

  const cartQuantity = cartItems.reduce((quantity) => quantity + 1, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const clearCart = () => setCartItems([]);

  const toggleLoading = () => setIsLoading(() => !isLoading);

  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function getAggregateItemQuantity(id: number) {
    const multiItems = getMultiItem(id);
    if (multiItems) {
      return multiItems.length;
    }

    return 0;
  }

  function getSelectedAddOns(id: number): AddOn[] | undefined {
    const addOns = cartItems.find((item) => item.id === id)?.addOns;
    return addOns?.filter((addOn) => addOn.isAdded);
  }

  function getMultiItem(id: number): CartItem[] | null {
    const idStr = String(id)[0];

    const filteredItems = cartItems.filter((item) => {
      const itemIdStr = String(item.id);
      return itemIdStr.startsWith(idStr);
    });

    return filteredItems.length > 0 ? filteredItems : null;
  }

  function createMultiItem(id: number): void {
    const existingMultiItems = getMultiItem(id);

    let currHighestId: number;

    if (existingMultiItems && existingMultiItems.length > 1) {
      currHighestId = Number(
        Math.max(...existingMultiItems.map((item) => item.id))
      );
    } else {
      currHighestId = id;
    }

    const idStr = String(currHighestId);
    const firstDigit = idStr[0];

    let nextHighestId: number = currHighestId + 1;

    if (String(nextHighestId)[0] !== firstDigit) {
      nextHighestId = Number(idStr + "1");
    }

    setCartItems((currItems) => {
      return [
        ...currItems,
        {
          id: nextHighestId,
          quantity: 1,
          addOns: defaultAddOns,
        },
      ];
    });
  }

  function getAddOnTotal(): number {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return 0;
    return cartItems.reduce((total, curr) => {
      return (
        total +
        (curr.addOns
          ? curr.addOns.reduce(
              (total, addOn) => (addOn.isAdded ? total + addOn.price : total),
              0
            )
          : 0)
      );
    }, 0);
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

  function increaseItemToothQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        if (storeItems.find((item) => item.id === id)?.prices["4"]) {
          return [...currItems, { id, quantity: 4, addOns: defaultAddOns }];
        } else {
          return [...currItems, { id, quantity: 1, addOns: defaultAddOns }];
        }
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            let newQuantity: 0 | 1 | 4 | 6 | 8 | 10;
            switch (item.quantity) {
              case 1:
                newQuantity = 6;
                break;
              case 4:
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
                newQuantity = 0;
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

  function decreaseItemToothQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems
          .map((item) => {
            if (item.id === id) {
              let newQuantity: 0 | 1 | 4 | 6 | 8 | 10;
              switch (item.quantity) {
                case 1:
                case 4:
                  newQuantity = 0;
                  break;
                case 6:
                  newQuantity = storeItems.find(
                    (storeItem) => storeItem.id === id
                  )?.prices["4"]
                    ? 4
                    : 1;
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
          })
          .filter((item) => item.quantity > 0);
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
        getAggregateItemQuantity,
        getSelectedAddOns,
        getMultiItem,
        createMultiItem,
        getAddOnTotal,
        updateAddOns,
        increaseItemToothQuantity,
        decreaseItemToothQuantity,
        setCartQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
        openCart,
        closeCart,
        clearCart,
        toggleLoading,
        isLoading,
        termsAccepted,
        setTermsAccepted,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen}></ShoppingCart>
    </ShoppingCartContext.Provider>
  );
}
