"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/todo/store";
import { toggleCollapse } from "@/features/SideBar/SideBar";
import { LuClipboardList } from "react-icons/lu";
import { CiCalendar, CiMap, CiStar } from "react-icons/ci";
import { MdOutlineAssignmentInd } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import { selectThemeProperties } from "@/features/theme/theme";
import useAuth from "@/utils/useAuth";
import { IoCloseSharp } from "react-icons/io5";

const Sidebar = () => {
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed
  );
  const themeProperties = useSelector((state: RootState) =>
    selectThemeProperties(state)
  );
  const [isOnAuthPage, setIsOnAuthPage] = useState(false);

  const user: any | null = useSelector((state: RootState) => state?.auth?.user) || null;
  const dispatch = useDispatch();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState("All Tasks");

  useAuth();

  const userFirstName = user?.user?.name.split(" ")[0];

  const sections = [
    { name: "All Tasks", link: "todo/", icon: <LuClipboardList className="mr-3" size={23} /> },
    { name: "Today", link: "todo/today-tasks", icon: <CiCalendar className="mr-3" size={23} /> },
    { name: "Important", link: "todo/important-tasks", icon: <CiStar className="mr-3" size={23} /> },
    { name: "Planned", link: " todo/", icon: <CiMap className="mr-3" size={23} /> },
    {
      name: "Assigned to me", link: " todo/",
      icon: <MdOutlineAssignmentInd className="mr-3" size={23} />,
    },
  ];

  return (
    <div className="flex h-full rounded-[20px]"
      style={{
        display: isOnAuthPage ? "none" : "flex",
      }}
    >
      <div
        ref={sidebarRef}
        style={{ backgroundColor: themeProperties.backgroundColor, color: themeProperties.textColor }}
        className={`md:relative fixed md:shadow-none shadow-2xl inset-y-0 left-0 ease-in-out h-full p-2 rounded-r-[20px] z-50 overflow-hidden transition-all duration-300 ${isCollapsed ? 'translate-x-0 w-[250px]' : 'md:-translate-x-[200px] -translate-x-full md:w-0 '}`}
      >
        <button className="absolute top-2 right-2 md:hidden" onClick={() => dispatch(toggleCollapse())}>
          <IoCloseSharp size={25} />
        </button>
        <div className="flex flex-col items-center py-2">
          <img
            src={
              !user
                ? "https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"
                : "https://www.pngitem.com/pimgs/m/404-4042710_circle-profile-picture-png-transparent-png.png"
            }
            className="w-20 h-20 rounded-full border-2 border-gray-300"
          />
          <h2 className="mt-4 text-lg font-semibold"
            style={{ color: themeProperties.textColor }}
          >
            {user ? userFirstName : <Link href="/auth">Login</Link>}
          </h2>
        </div>
        <nav className="mt-2 p-4 rounded-lg"
          style={{ backgroundColor: themeProperties.backgroundBox }}
        >
          {sections.map((section) => (
            <Link
              key={section.name}
              href={`/${section.link}`}
              className={`flex items-center py-2 px-4 rounded-lg text-sm ${themeProperties.textColor != "#000000" ? "hover:bg-[#1d1d1d]" : "hover:bg-gray-200"} ${activeSection === section.name ? themeProperties.textColor != "#000000" ? "bg-[#1d1d1d] text-[#357937]" : "bg-[#EEF6EF] text-[#357937]" : ""}`}
              onClick={() => setActiveSection(section.name)}
            >
              {section.icon} {section.name}
            </Link>
          ))}
        </nav>
        <div className="mt-2 px-4 rounded-lg"
          style={{ backgroundColor: themeProperties.backgroundBox }}
        >
          <a
            href="#"
            className="flex items-center py-3 px-4 rounded-lg"
            style={{ color: themeProperties.textColor }}
          >
            <IoAdd className="mr-3 text-gray-500" /> Add List
          </a>
        </div>
        <div className="w-full mt-2">
          <div className="p-4 rounded-lg shadow"
            style={{ backgroundColor: themeProperties.backgroundBox }}
          >
            <div className="">
              <h3 className="font-semibold text-sm">Today Tasks</h3>
              <div className="text-lg"> 4 </div>
            </div>
            <div className="flex justify-center mt-2">
              <div className="w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 40 28">
                  <circle
                    cx="18"
                    cy="16"
                    r="15"
                    fill="none"
                    stroke="#e5e5e5"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="16"
                    r="15"
                    fill="none"
                    stroke="#4caf50"
                    strokeWidth="4"
                    strokeDasharray="75, 100"
                    strokeDashoffset="25"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center mt-2 text-sm flex gap-4">
              <div className="text-green-500">
                <span> ● </span>
                Done</div>
              <div className="text-gray-500">
                <span className=""> ● </span>
                Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;