"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [selected, setSelected] = useState([]);

  // 从 localStorage 恢复
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("compare_cabins") || "[]");
      if (Array.isArray(saved)) setSelected(saved);
    } catch {}
  }, []);

  function toggle(cabin) {
    setSelected((prev) => {
      let next;
      if (prev.find((c) => c.id === cabin.id)) {
        next = prev.filter((c) => c.id !== cabin.id);
      } else {
        if (prev.length >= 3) return prev;
        next = [...prev, cabin];
      }
      localStorage.setItem("compare_cabins", JSON.stringify(next));
      return next;
    });
  }

  function remove(id) {
    setSelected((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem("compare_cabins", JSON.stringify(next));
      return next;
    });
  }

  function clear() {
    setSelected([]);
    localStorage.removeItem("compare_cabins");
  }

  return (
    <CompareContext.Provider value={{ selected, toggle, remove, clear }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
