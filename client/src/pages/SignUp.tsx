import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation, useSignInMutation } from "../query/mutation/auth";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const signUpMutation = useSignUpMutation();
  const signInMutation = useSignInMutation();

  const handleSignUp = async () => {
    setError("");
    try {
      await signUpMutation.mutateAsync({ name, email, password });
      await signInMutation.mutateAsync({ email, password });
      navigate("/chat");
    } catch (err) {
      const errorMessage =
        (err as any).response?.data?.message || "회원가입에 실패했습니다.";
      setError(errorMessage);
    }
  };

  return (
    <div>
      <h1>회원가입</h1>
      {error && <p>{error}</p>}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button
        onClick={handleSignUp}
        disabled={signUpMutation.isPending || signInMutation.isPending}
      >
        Sign Up
      </button>
      <p>
        이미 회원이신가요? <Link to="/">로그인</Link>
      </p>
    </div>
  );
}
