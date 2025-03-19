import { ButtonProps } from "../interfaces/components/Button.interface";

export default function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-primary ${className}`}>
      {children}
    </button>
  );
}
