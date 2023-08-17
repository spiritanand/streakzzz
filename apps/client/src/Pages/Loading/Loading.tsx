import "./Loading.css";
import { twMerge } from "tailwind-merge";

function Loading({ className = "" }) {
  return (
    <div className={twMerge("flex items-center justify-center", className)}>
      <div className="lds-dual-ring"></div>
    </div>
  );
}

export default Loading;
