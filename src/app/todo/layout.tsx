"use client";
import "../globals.css";
import ReduxProvider from "./ReduxProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/SideBar/SideBar";
import "../index.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/todo/store";
import Loader from "@/components/Loader/Loader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className=" h-screen w-full flex flex-col justify-center items-center">
          Loading your data...
          <Loader />
      </div>
    );
  }

  return (
    <div className=" h-screen overflow-hidden">
      <Toaster />
      <ReduxProvider>
        <div className=" flex flex-col w-screen">
          <div className="h-[40px] w-full">
            <Navbar />
          </div>
          <div className="p-2 h-[calc(100vh-40px)] flex w-full">
            <Sidebar />
            <div className="h-full w-full">{children}</div>
          </div>
        </div>
      </ReduxProvider>
    </div>
  );
}
