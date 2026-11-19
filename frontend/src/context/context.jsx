import { useState } from "react";
import { UserContext } from "./UserContext";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [current, setCurrent] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        current,
        setCurrent,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
