import { useEffect } from "react";

const useScrollRestoration = () => {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"; // Disable automatic scroll restoration
    }
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto"; // Reset on cleanup
      }
    };
  }, []);
};

export default useScrollRestoration;