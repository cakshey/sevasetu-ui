import { useState, useCallback } from "react";

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, title, message, duration = 4000) => {
    const id = ++toastCounter;
    const toast = { id, type, title, message };
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}
