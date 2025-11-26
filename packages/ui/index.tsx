import type { CSSProperties, ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary";

const variantStyles: Record<Variant, CSSProperties> = {
  primary: {
    background: "linear-gradient(90deg, #c41e3a, #165b33)",
    color: "#fff"
  },
  secondary: {
    backgroundColor: "#fff",
    border: "1px solid #d1d5db",
    color: "#0f172a"
  }
};

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
};

export function Button({
  variant = "primary",
  style,
  ...props
}: ButtonProps) {
  const shared: CSSProperties = {
    borderRadius: 999,
    fontWeight: 600,
    padding: "0.5rem 1.5rem",
    cursor: "pointer",
    transition: "transform 150ms ease, box-shadow 150ms ease"
  };

  return (
    <button
      {...props}
      style={{
        ...shared,
        ...variantStyles[variant],
        boxShadow: variant === "primary" ? "0 10px 25px rgba(196,30,58,0.35)" : "none",
        transform: "translateY(0)",
        ...style
      }}
    />
  );
}
