"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useAuth } from "@/context/auth-context";

const Navigation = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    lcid: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    lcid: "",
    phone: "",
    password: "",
  });
  const router = useRouter();
  // Capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const LCID_REGEX = /^LC000\d{8}$/; // Matches LC000 followed by exactly 8 digits

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Only allow numbers and limit to 10 digits
      const phoneRegex = /^\d{0,10}$/;
      if (phoneRegex.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
        setErrors((prev) => ({
          ...prev,
          phone: value.length === 10 ? "" : "Phone number must be 10 digits",
        }));
      }
    } else if (name === "name") {
      // Capitalize first letter of each word
      const capitalizedName = capitalizeWords(value);
      setFormData((prev) => ({
        ...prev,
        [name]: capitalizedName,
      }));
      setErrors((prev) => ({
        ...prev,
        name: value.trim() ? "" : "Name is required",
      }));
    } else if (name === "lcid") {
      const upperValue = value.toUpperCase();
      // More permissive regex for input
      const LCID_INPUT_REGEX = /^L?C?0?0?0?\d{0,8}$/;

      if (upperValue === "" || LCID_INPUT_REGEX.test(upperValue)) {
        setFormData((prev) => ({
          ...prev,
          [name]: upperValue,
        }));

        // Validate the complete LCID only when length matches
        setErrors((prev) => ({
          ...prev,
          lcid:
            upperValue === ""
              ? "LCID is required"
              : upperValue.length > 0 && !LCID_REGEX.test(upperValue)
              ? "LCID must be in format LC000XXXXXXXX"
              : "",
        }));
      }
    } else if (name === "password") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prev) => ({
        ...prev,
        password:
          value.length >= 8 ? "" : "Password must be at least 8 characters",
      }));
    }
  };

  const handleSignUp = async () => {
    // Validate before submission
    const newErrors = {
      phone:
        formData.phone.length !== 10 ? "Phone number must be 10 digits" : "",
      name: !formData.name.trim() ? "Name is required" : "",
      lcid: !formData.lcid
        ? "LCID is required"
        : !LCID_REGEX.test(formData.lcid)
        ? "LCID must be in format LC000XXXXXXXX"
        : "",
      password: !formData.password.trim() ? "Password is required" : "",
    };
    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error signing up:", errorData.error);
        setErrors((prev) => ({
          ...prev,
          lcid: errorData.error,
        }));

        return;
      }
      login({
        lcid: formData.lcid,
        name: formData.name,
        isAuthenticated: true,
      });

      router.push(`/user/${formData.lcid}`);
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  // Input field configurations
  const inputFields = [
    {
      name: "name",
      label: "Name",
      placeholder: "Enter your name",
      helpText: "",
      isValid: formData.name.trim() !== "",
    },
    {
      name: "lcid",
      label: "LCID Number",
      placeholder: "Enter your LCID number",
      helpText: "Please use your verified LCID number.",
      isValid: /^LC000\d{8}$/.test(formData.lcid),
    },
    {
      name: "phone",
      label: "Phone Number",
      placeholder: "Enter your phone number (10 digits)",
      helpText: "We will send you message on this number for prices.",
      maxLength: 10,
      isValid: formData.phone.length === 10,
    },
    {
      name: "password",
      label: "Your Password",
      placeholder: "Enter your password",
      helpText: "Please use a strong password.",
      maxLength: 18,
      isValid: formData.password.length >= 8,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full p-8">
      <div className="flex flex-col gap-4 w-full max-w-md mt-8">
        {inputFields.map((field) => (
          <label key={field.name} className="flex flex-col">
            <span className="mb-2">{field.label}</span>
            <div className="relative flex w-full items-center">
              <Input
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                className="pr-8"
              />
              {field.isValid && (
                <IoCheckmarkCircle className="absolute right-2 text-green-500 text-xl" />
              )}
            </div>
            {errors[field.name as keyof typeof errors] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name as keyof typeof errors]}
              </p>
            )}
            {field.helpText && (
              <p className="text-sm text-gray-400 mt-1">{field.helpText}</p>
            )}
          </label>
        ))}
      </div>

      <div className="flex gap-6 mt-6">
        <Button
          onClick={handleSignUp}
          disabled={
            !!errors.phone ||
            !!errors.name ||
            !!errors.lcid ||
            !!errors.password
          }
        >
          <FaUser className="mr-2" /> Sign Up
        </Button>
      </div>
    </div>
  );
};

export default Navigation;
