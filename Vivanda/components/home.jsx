import { Login } from "./login";
import { useState } from "react";
export const MainPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={()=>setIsOpen(true)}>Abrir Login</button>
      {isOpen && <Login onClose={() => setIsOpen(false)} />}
    </div>
  );
}