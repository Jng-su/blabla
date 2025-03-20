import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignInMutation } from "../query/mutation/auth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const signInMutation = useSignInMutation();

  const handleSignIn = async () => {
    setError("");
    try {
      await signInMutation.mutateAsync({ email, password });
      navigate("/chat");
    } catch (err) {
      setError(
        (err as any).response?.data?.message || "로그인에 실패했습니다."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">블라블라</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          className="w-full p-3 mb-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primaryHover"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
        />
        <input
          className="w-full p-3 mb-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primaryHover"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="비밀번호"
        />
        <button
          onClick={handleSignIn}
          className="btn-primary"
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending ? "로그인 중..." : "로그인"}
        </button>
        <p className="text-gray-400 text-center mt-4">
          아직 회원이 아니신가요?{" "}
          <Link to="/signup" className="text-purple-400 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
