"use client";   // Yeh line hata do agar Vite mein nahi chahiye

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token) {
      navigate("/auth");
      return;
    }

    let user = null;

    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        console.error("User parse error");
      }
    }

    // Token se decode if user not in localStorage
    if (!user && token) {
      const decoded = decodeJWT(token);
      if (decoded?.id) {
        user = {
          id: decoded.id,
          role: decoded.role,
        };
      }
    }

    if (!user || !user.id) {
      navigate("/auth");
      return;
    }

    // Role Authorization
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      const userId = user.id || user._id;
      if (user.role === "farmer") {
        navigate(`/farmer-dashboard/${userId}`);
      } else {
        navigate(`/user-dashboard/${userId}`);
      }
      return;
    }

    setIsAllowed(true);
    setLoading(false);
  }, [navigate, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return isAllowed ? children : null;
}
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT Decode Error:", e);
    return null;
  }
}