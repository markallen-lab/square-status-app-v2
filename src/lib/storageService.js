
export const setItem = (key, value, ttl = null) => {
  const item = {
    value,
    expiry: ttl ? Date.now() + ttl * 1000 : null,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getItem = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  if (item.expiry && Date.now() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

export const removeItem = (key) => {
  localStorage.removeItem(key);
};
