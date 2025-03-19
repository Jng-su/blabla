import { useState } from "react";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Main from "./components/Main";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "signIn" | "signUp" | "main"
  >("home");

  return (
    <div>
      {currentScreen === "home" && (
        <Home
          onLogin={() => setCurrentScreen("signIn")}
          onSignUp={() => setCurrentScreen("signUp")}
        />
      )}
      {currentScreen === "signIn" && (
        <SignIn onBack={() => setCurrentScreen("home")} />
      )}
      {currentScreen === "signUp" && (
        <SignUp onBack={() => setCurrentScreen("home")} />
      )}
      {currentScreen === "main" && <Main />}
    </div>
  );
}
