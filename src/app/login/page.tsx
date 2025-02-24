"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [viewPassword, setViewPassword] = useState(false);

  const [formData, setFormData] = useState({
    lcid: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    lcid: "",
    password: "",
  });

  const LCID_REGEX = /^LC000\d{8}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "lcid") {
      const upperValue = value.toUpperCase();
      const LCID_INPUT_REGEX = /^L?C?0?0?0?\d{0,8}$/;

      if (upperValue === "" || LCID_INPUT_REGEX.test(upperValue)) {
        setFormData((prev) => ({ ...prev, [name]: upperValue }));
        setErrors((prev) => ({
          ...prev,
          lcid:
            upperValue === ""
              ? "LCID is required"
              : !LCID_REGEX.test(upperValue) && upperValue.length > 0
              ? "LCID must be in format LC000XXXXXXXX"
              : "",
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({
        ...prev,
        password:
          value.length < 8 ? "Password must be at least 8 characters" : "",
      }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    const newErrors = {
      lcid: !formData.lcid
        ? "LCID is required"
        : !LCID_REGEX.test(formData.lcid)
        ? "Invalid LCID format"
        : "",
      password: !formData.password
        ? "Password is required"
        : formData.password.length < 8
        ? "Password must be at least 8 characters"
        : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.for === "lcid") {
          setErrors((prev) => ({
            ...prev,
            lcid: errorData.error,
          }));
        } else if (errorData.for === "password") {
          setErrors((prev) => ({
            ...prev,
            password: errorData.error,
          }));
        }
        return;
      }

      const userData = await response.json();
      login({
        lcid: userData.student.lcid,
        name: userData.student.name,
        isAuthenticated: true,
      });

      router.push(`/user/${formData.lcid}`);
    } catch (error) {
      console.error("Login error:", error);
      setErrors((prev) => ({
        ...prev,
        lcid: "An error occurred during login",
      }));
    }
  };

  return (
    <div className="flex  items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="space-y-8 w-full max-w-4xl p-8 bg-white rounded-lg shadow-md"
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-500">Please enter your details to login</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium block">LCID Number</label>
            <Input
              name="lcid"
              value={formData.lcid}
              onChange={handleChange}
              placeholder="Enter your LCID"
              className={`w-full max-w-3xl px-4 py-2 ${
                errors.lcid ? "border-red-500" : ""
              }`}
            />
            {errors.lcid && (
              <p className="text-red-500 text-sm">{errors.lcid}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Password</label>
            <div className="flex items-center gap-2">
              <Input
                type={viewPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-2 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />

              <Button
                size={"icon"}
                onClick={(e) => {
                  e.preventDefault();
                  setViewPassword(!viewPassword);
                }}
              >
                {viewPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-2 text-base"
          disabled={!!errors.lcid || !!errors.password}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
