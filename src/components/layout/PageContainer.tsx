import type { HTMLAttributes, ReactNode } from "react";

type PageContainerProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  children: ReactNode;
};

export default function PageContainer({
  children,
  className = "",
  ...props
}: PageContainerProps) {
  return (
    <main
      id="main"
      className={`foundation-main ${className}`.trim()}
      {...props}
    >
      {children}
    </main>
  );
}
