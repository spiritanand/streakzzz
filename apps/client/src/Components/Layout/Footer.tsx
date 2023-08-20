import { GitHub } from "react-feather";

const Footer = () => {
  return (
    <footer className="flex justify-center">
      <a
        href="https://github.com/spiritanand/streakzzz"
        rel="noreferrer"
        target="_blank"
        className="rounded-2xl bg-gray-600 p-2"
      >
        <GitHub />
      </a>
    </footer>
  );
};

export default Footer;
