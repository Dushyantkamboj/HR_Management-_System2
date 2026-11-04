import { useState } from "react";
import { UserContext } from "./UserContext";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [current, setCurrent] = useState("Dashboard");

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        current,
        setCurrent,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;