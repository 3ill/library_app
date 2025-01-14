import { auth } from "@/auth";
import Header from "@/components/header";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface ILayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: ILayoutProps) => {
  const session = await auth();
  if (!session) return redirect("/sign-in");
  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
