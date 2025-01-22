"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image"; // For rendering the logo image
import { RxHamburgerMenu } from "react-icons/rx"; // Hamburger menu icon
import { CiSearch } from "react-icons/ci";
import { MdDashboard } from "react-icons/md";
import Logo from "@/assets/images/logo.png";
import ThemeToggle from "../SwitchTheme/SwitchTheme";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/todo/store";
import { selectThemeProperties } from "@/features/theme/theme";
import {  toggleCollapse } from "@/features/SideBar/SideBar";
import Link from "next/link";
import { logout } from "@/features/auth/auth";



const Navbar = () => {
  const themeProperties = useSelector((state: RootState) =>
    selectThemeProperties(state)
  );
  const user = useSelector((state: RootState) => state.auth.user as any);

  const dispatch = useDispatch();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    dispatch(toggleCollapse());
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedIsCollapsed = localStorage.getItem("isCollapsed");
      if (storedIsCollapsed === null) {
        localStorage.setItem("isCollapsed", "false");
      } else {
        setIsCollapsed(storedIsCollapsed === "true");
      }
    }
  }, []);

  return (
    <div className="navbar flex items-center justify-between px-10 py-2">
      <div className="flex items-center gap-2">
        <RxHamburgerMenu
          size={24}
          className="cursor-pointer"
          style={{ color: themeProperties.textColor }}
          onClick={toggleSidebar}
        />
        <Image src={Logo} alt="Logo" className=" w-20" />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <button
            onClick={() => {
              dispatch(logout());
              if (typeof window !== "undefined") {
                localStorage.removeItem("token");
              }
              window.location.reload();
            }}
          >
            Logout
          </button>
        ) : (
          <Link href="/auth">Login</Link>
        )}
        <MdDashboard
          size={22}
          className="cursor-pointer"
          style={{ color: themeProperties.textColor }}
        />
        <ThemeToggle themeProperties={themeProperties} />
      </div>
    </div>
  );
};

export default Navbar;
