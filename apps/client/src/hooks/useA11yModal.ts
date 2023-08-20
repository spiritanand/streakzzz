import React, { useEffect } from "react";

export default function useA11yModal(
  setAddTodo: React.Dispatch<React.SetStateAction<boolean>>,
) {
  // Focus on the add to-do when the component mounts
  useEffect(() => {
    const firstInput = document.querySelector(
      "#todo",
    ) as HTMLInputElement | null;

    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  // Close the add to-do modal when the user presses the escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAddTodo(false);
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [setAddTodo]);
}
