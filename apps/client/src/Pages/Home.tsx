import { Navigate } from "react-router-dom";

const Home = () => {
  return <Navigate to="/login" replace={true} />;
};

export default Home;
