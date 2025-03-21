import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignInMutation } from "../query/mutation/auth";
import { MessageSquareMore } from "lucide-react";

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
    <div className="w-[25%] min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex justify-center gap-2 mb-6">
          <MessageSquareMore size={36} className="text-primary" />
          <h1 className="text-3xl font-bold text-center">blabla</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold">Email</p>
            <input
              className="input-style w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
            />
          </div>
          <div>
            <p className="font-bold">Password</p>
            <input
              className="input-style w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSignIn}
            disabled={signInMutation.isPending}
            className="btn-primary w-full"
          >
            {signInMutation.isPending ? "로그인 중..." : "로그인"}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        <p className="text-gray-400 text-center mt-4">
          아직 회원이 아니신가요?{" "}
          <Link
            to="/signup"
            className="text-secondary hover:underline hover:text-primary"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
