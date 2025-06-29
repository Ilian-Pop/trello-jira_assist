import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import "./styles/home.css";
import { checkLoginFunction } from "./functions/checkLoginFunction";
function App() {
  const [checkLogin, setChekLogin] = useState(false);
  useEffect(() => {
    async function fetchLoginStatus() {
      const isLoggedIn = await checkLoginFunction();
      setChekLogin(isLoggedIn);
      localStorage.setItem("platform", "trello");
    }
    fetchLoginStatus();
  }, []);

  return (
    <>
      {checkLogin ? (
        <Chat setLogin={setChekLogin} />
      ) : (
        <Login setLogin={setChekLogin} />
      )}
    </>
  );
}
export default App;
