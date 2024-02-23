import { useNavigate } from "react-router-dom";
import notFound from "../assets/404.svg";
const Error404 = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center max-w-2xl mx-auto">
      <img
        width={600}
        height={400}
        className="w-full"
        src={notFound}
        alt="404"
      />
      <h1 className="font-medium mb-1">page not found</h1>
      <button className="btn-submit" onClick={() => navigate("/")}>
        go to home Page
      </button>
    </div>
  );
};

export default Error404;
