"use client";

import { Button } from "@/components/ui/button";
import React from "react";
// import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { BsGraphUpArrow } from "react-icons/bs";
const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleLogin = () => {
    router.push("/login");
  };
  const handleLogout = () => {
    logout();
    router.push("/");
  };
  return (
    <div className="flex items-center justify-between p-4 gap-2">
      {/* <Image
        src="/texas-mgmt-id.png"
        alt="College Logo"
        width={150}
        height={150}
        className="w-[150px] h-auto sm:w-[100px] xs:w-[80px]"
        priority
      /> */}
      <BsGraphUpArrow className="text-primary text-2xl md:text-4xl" />
      <div className="flex gap-3 sm:gap-2">
        {isAuthenticated ? (
          <>
            <span className="text-sm self-center mr-2">
              Welcome, {user?.lcid}
            </span>
            <Button size="sm" className="sm:text-sm" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : pathname === "/signup" ? (
          <Button size="sm" className="sm:text-sm" onClick={handleLogin}>
            Login
          </Button>
        ) : (
          <Button size="sm" className="sm:text-sm" onClick={handleSignUp}>
            SignUp
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navigation;
