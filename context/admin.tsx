"use client";

import { createContext, useContext, useState } from "react";

const AdminContext = createContext<{
  admin: boolean;
  setAdmin: (isAdmin: boolean) => void;
}>({
  admin: false,
  setAdmin: () => {},
});

export const AdminProvider = ({
  children,
  initialAdmin
}: {
  children: React.ReactNode,
  initialAdmin: boolean;
}) => {
  const [admin, setAdmin] = useState(initialAdmin);

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);