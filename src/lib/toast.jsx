import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description }) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, title, description }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto border border-border bg-card px-4 py-3 shadow-lg min-w-64 max-w-sm"
          >
            <p className="font-display font-bold text-sm text-foreground">
              {item.title}
            </p>
            {item.description ? (
              <p className="font-mono text-[11px] text-muted-foreground mt-1">
                {item.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
