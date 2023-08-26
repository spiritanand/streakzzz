import { Link } from "react-router-dom";

import Button from "../Components/UI/Button.tsx";

function Error() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-20">
      <h1 className="flex flex-col gap-5 text-center text-6xl uppercase">
        <span>404.</span>
        <span>page not found.</span>
      </h1>
      <Link to="/">
        <Button className="p-5">Home</Button>
      </Link>
      <a
        href="https://www.amazon.com/Interstellar-Matthew-McConaughey/dp/B00TU9UFTS"
        className="text-2xl font-bold underline"
      >
        I want to get lost
      </a>
    </div>
  );
}

export default Error;
