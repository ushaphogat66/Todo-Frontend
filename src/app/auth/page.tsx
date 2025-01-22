"use client";

import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import BG1 from "../../../public/BG2.png";
import { login, authUser, signup } from "../../features/auth/auth";
import { RootState, AppDispatch } from "../todo/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EyeOffIcon } from "lucide-react";
import { EyeIcon } from "lucide-react";
import { selectThemeProperties } from "../../features/theme/theme";

const Login: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth
  );
  const themeProperties = useSelector((state: RootState) =>
    selectThemeProperties(state)
  );
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      dispatch(authUser()).then((response) => {
        console.log(response.payload);
      });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      tasks: typeof window !== "undefined" && localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks") as string) : [],
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
      name: Yup.string().when("isSignup", (isSignup, schema) =>
        isSignup ? schema.required("Required") : schema.notRequired()
      ),
    }),
    onSubmit: (values) => {
      if (isSignup) {
        dispatch(signup(values)).then((response) => {
          if (response.payload) {
          }
        });
      } else {

        dispatch(login(values)).then((response) => {
          if (response.payload) {
          }
        });
      }
    },
  });

  const [backgroundPosition, setBackgroundPosition] = useState("100% 0%");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBackgroundPosition(window.innerWidth > 768 ? "center" : "100% 0%");
    }

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if ( token) {
        window.location.href = "/";
      }
  }, []);

  return (
    <div
      className="flex h-screen items-center justify-center bg-left-top"
      style={{
        background: ` ${ themeProperties.backgroundColor== "#000000" ? themeProperties?.bgImage : `url(${BG1.src})`}`,
        backgroundSize: "cover",
        backgroundPosition: backgroundPosition,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex xl:flex-row flex-col rounded-[10px] overflow-hidden h-[90vh] w-[90vw] xl:gap-40">
        <div className="xl:flex-1 justify-center items-center flex">
          <div className=" xl: flex-col items-center xl:felx  xl:visible">
            <h1
              className="xl:text-[100px] text-[70px] font-bold xl:text-clip text-white "
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor:
                  backgroundPosition === "center" ? "transparent" : "white",
                backgroundImage: `url(${BG1.src})`,
                backgroundSize: "200%",
                backgroundPosition: "100% 10%",
              }}
            >
              Welcome
            </h1>
            <p className="mt-4 text-[20px] text-center"></p>
          </div>
        </div>

        {/* Right Side */}
        <div className="xl:w-[40vw] h-full w-full xl:bg-[#ffffff48]  bg-[#ffffff48]  backdrop-blur-lg p-10 rounded-3xl shadow-lg">
          <h2 className="text-3xl font-semibold text-white text-center">
            {isSignup ? "Signup" : "Login"}{" "}
          </h2>
          <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
            {/* Name Field */}
            {isSignup && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full mt-2 p-3 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all duration-300 focus:border-transparent"
                  placeholder="Enter your name"
                  {...formik.getFieldProps("name")}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>
            )}

            {/* email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                className="w-full mt-2 p-3 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all duration-300 focus:border-transparent"
                placeholder="Enter your email"
                style={{ backgroundColor: themeProperties.backgroundColor }}
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full mt-2 p-3 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all duration-300 focus:border-transparent"
                placeholder="Enter your password"
                style={{ backgroundColor: themeProperties.backgroundColor }}
                {...formik.getFieldProps("password")}
              />

              <div
                className="absolute right-4 top-10 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeIcon size={20} />
                ) : (
                  <EyeOffIcon size={20} />
                )}
              </div>

              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>

            {/* Login Button */}
            <div className="text-center">
              <button
                type="submit"
                className="py-3 px-10 rounded-lg text-black font-semibold shadow-xl hover:bg-gray-200 transition duration-200"
                style={{ backgroundColor: themeProperties.backgroundColor, 
                color: themeProperties.textColor
                 }}
                // disabled={loading}
                onClick={() => {
                  if (!isSignup) {
                    dispatch(login(formik.values)).then((response) => {
                      if (response.payload) {
                        router.push("/ ");
                      }
                    });
                  }
                }}
              >
                {loading
                  ? isSignup
                    ? "Signing up..."
                    : "Logging in..."
                  : isSignup
                  ? "Signup"
                  : "Login"}
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-1 text-center">
                {error}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center mt-6">
              <hr className="flex-1 border-gray-50" />
              <span className="mx-4 text-white text-sm">or</span>
              <hr className="flex-1 border-gray-50" />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-100">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <a
                  href="#"
                  className="text-[#FFF] hover:underline"
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup ? "Login" : "Create one"}
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
