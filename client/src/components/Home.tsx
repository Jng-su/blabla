import { HomeProps } from "../interfaces/components/Home.interface";
import Button from "./Button";

export default function Home({ onLogin, onSignUp }: HomeProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">블라블라</h1>
      <p className="mb-4">Welcome to blabla chat app!</p>
      <div className="w-80 flex gap-4">
        <Button onClick={onLogin} className="w-full">
          Sign In
        </Button>
        <Button onClick={onSignUp} className="w-full">
          Sign Up
        </Button>
      </div>
    </div>
  );
}
