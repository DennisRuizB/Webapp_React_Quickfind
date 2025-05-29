import React, { useEffect, useRef, useState } from "react";
import "./Home.modules.css";
import { animate } from "animejs";
import { useLocation, useNavigate } from "react-router-dom";
import BarcelonaMap from "../../Maps/MapBarcelona/MapBarcelona";
import { getUserById } from "../../../service/userService";
import QuickPerfil from "../../Profiles/QuickPerfil/QuickPerfil";

const Home: React.FC = () => {
  const fotoLupa = "https://cdn-icons-png.flaticon.com/512/4715/4715177.png";
  const location = useLocation();
  const navigate = useNavigate();

  const prov_user = location.state?.user;
  const userFromStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  const [user, setUser] = useState(prov_user || userFromStorage);
  const [showQuickPerfil, setShowQuickPerfil] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const userName: string = user?.name || "Guest";
  const text = `WELCOME ${userName.toUpperCase()}`;

  const toggleQuickPerfil = () => {
    setShowQuickPerfil((prev) => !prev);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.warn("No user ID found. Redirecting to login...");
        navigate("/login");
        return;
      }

      try {
        const updatedUser = await getUserById(userId);
        setUser(updatedUser);
        console.log("User data fetched:", updatedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (headingRef.current) {
        const spans = headingRef.current.querySelectorAll("span");
        if (spans.length > 0) {
          animate(spans, {
            y: [
              { to: "-2.75rem", ease: "outExpo", duration: 600 },
              { to: 0, ease: "outBounce", duration: 800, delay: 100 },
            ],
            rotate: {
              from: "-1turn",
              delay: 0,
            },
            delay: (_, i) => i * 50,
            ease: "inOutCirc",
            loopDelay: 1000,
            loop: true,
          });
        }
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2 ref={headingRef}  className="tittle">
          {text.split("").map((char, index) => (
            <span key={index}>{char === " " ? "\u00A0" : char}</span>
          ))}
        </h2>
        <img src={fotoLupa} className="App-logo" alt="logo" />
        <BarcelonaMap />
      </header>
    </div>
  );
};

export default Home;
