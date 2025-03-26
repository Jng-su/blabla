import { SidebarButtonProps } from "../../types/main-props";

export default function SidebarButton({
  icon,
  category,
  activeCategory,
  onClick,
}: SidebarButtonProps) {
  const isActive = activeCategory === category;
  return (
    <button
      className={`sidebar-button ${isActive ? "text-white bg-primary" : ""}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
