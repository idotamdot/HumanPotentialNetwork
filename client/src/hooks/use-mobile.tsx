import { useState, useEffect } from "react";

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if the current viewport is mobile-sized
    const checkIfMobile = () => {
      // Standard breakpoint for mobile devices (tailwind md breakpoint)
      setIsMobile(window.innerWidth < 768);
    };

    // Run on initial load
    checkIfMobile();

    // Set up event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return { isMobile };
}
