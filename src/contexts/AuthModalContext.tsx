"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isOpen: boolean;
  content: ReactNode;
  openModal: (tab: "login" | "signup") => void;
  closeModal: () => void;
  tab: undefined | "login" | "signup";
  setTab: (value: undefined | "login" | "signup") => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<undefined | "login" | "signup">(undefined);

  const openModal = (tab: "login" | "signup") => {
    setIsOpen(true);
    setTab(tab);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTab(undefined);
  };

  return (
    <ModalContext.Provider
      value={{ isOpen, content: null, openModal, closeModal, tab, setTab }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
