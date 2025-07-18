// src/components/ui/use-toast.jsx
import { useState, useEffect } from 'react';

const TOAST_LIMIT = 1;

let count = 0;
function generateId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastStore = {
  state: {
    toasts: [],
  },
  listeners: [],

  getState: () => toastStore.state,

  setState: (nextState) => {
    if (typeof nextState === 'function') {
      toastStore.state = nextState(toastStore.state);
    } else {
      toastStore.state = { ...toastStore.state, ...nextState };
    }

    toastStore.listeners.forEach((listener) => listener(toastStore.state));
  },

  subscribe: (listener) => {
    toastStore.listeners.push(listener);
    return () => {
      toastStore.listeners = toastStore.listeners.filter((l) => l !== listener);
    };
  },
};

export const toast = ({ ...props }) => {
  const id = generateId();

  const dismiss = () =>
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => t.id !== id),
    }));

  const update = (props) =>
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...props } : t)),
    }));

  toastStore.setState((state) => ({
    ...state,
    toasts: [
      {
        ...props,
        id,
        // Store dismiss separately to avoid spreading it into DOM props
        __internal_dismiss__: dismiss,
      },
      ...state.toasts,
    ].slice(0, TOAST_LIMIT),
  }));

  return {
    id,
    dismiss,
    update,
  };
};

export function useToast() {
  const [state, setState] = useState(toastStore.getState());

  useEffect(() => {
    const unsubscribe = toastStore.subscribe((state) => {
      setState(state);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const timeouts = [];

    state.toasts.forEach((toast) => {
      if (toast.duration === Infinity) return;

      const timeout = setTimeout(() => {
        toast.__internal_dismiss__?.();
      }, toast.duration || 5000);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [state.toasts]);

  return {
    toast,
    toasts: state.toasts.map(({ __internal_dismiss__, ...rest }) => ({
      ...rest,
      dismiss: __internal_dismiss__,
    })),
  };
}
