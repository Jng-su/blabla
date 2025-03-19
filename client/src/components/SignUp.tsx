import { SignUpProps } from "../interfaces/components/SignUp.interface";
import Button from "./Button";

export default function SignUp({ onBack }: SignUpProps) {
  return (
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg w-80">
      <h2 className="text-xl font-bold mb-4">회원가입</h2>
      <input
        type="text"
        placeholder="아이디"
        className="p-2 mb-2 w-full border rounded"
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="p-2 mb-4 w-full border rounded"
      />
      <Button className="w-full">Sign Up</Button>
      <Button onClick={onBack} className="w-full mt-2">
        뒤로가기
      </Button>
    </div>
  );
}
