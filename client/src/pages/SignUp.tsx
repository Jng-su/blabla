import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../query/mutation/auth";
import { MessageSquareMore } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const signUpMutation = useSignUpMutation();

  const handleSignUp = async () => {
    setError("");
    try {
      await signUpMutation.mutateAsync({ name, email, password });
      navigate("/chat");
    } catch (err) {
      setError(
        (err as any).response?.data?.message || "회원가입에 실패했습니다."
      );
    }
  };

  return (
    <div className="w-[25%] min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex justify-center gap-2 mb-6">
          <MessageSquareMore size={36} className="text-primary" />
          <h1 className="text-3xl font-bold text-center">회원가입</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold">Name</p>
            <input
              className="input-style w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
            />
          </div>
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
            onClick={handleSignUp}
            disabled={signUpMutation.isPending}
            className="btn-primary w-full"
          >
            {signUpMutation.isPending ? "가입 중..." : "회원가입"}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        <p className="text-gray-400 text-center mt-4">
          이미 회원이신가요?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
