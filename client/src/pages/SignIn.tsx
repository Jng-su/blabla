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
      navigate("/main");
    } catch (err) {
      setError(
        (err as any).response?.data?.message || "로그인에 실패했습니다."
      );
    }
  };

  return (
    <div className="w-[25%] min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <img
            src="https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/default-chat-image.png"
            alt="Chat Logo"
            className="w-9 h-9"
          />
          <h1 className="text-3xl font-bold text-center">blabla</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold">Email</p>
            <input
              className="input-style w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="blabla@blabla.com"
            />
          </div>
          <div>
            <p className="font-bold">Password</p>
            <input
              className="input-style w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="blabla"
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

        <div className="mt-4">
          <p>
            <span className="font-bold">email:</span> blabla@blabla.com{" "}
          </p>
          <p>
            <span className="font-bold">password:</span> blabla
          </p>
        </div>
      </div>
    </div>
  );
}
