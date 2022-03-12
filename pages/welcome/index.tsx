import { render } from "react-dom";
import "../../styles/main.css";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white text-center gap-4 select-none">
      <h2 className="text-xl text-gray-800">Welcome to Skye</h2>

      <h1 className="text-4xl font-bold text-gray-800">
        The browser that isn't
        <br />
        absolute sh*t
      </h1>
      <button className="py-3 px-5 bg-gray-900 rounded-xl shadow-md text-white">
        Get Started
      </button>
    </div>
  );
};

export default render(<Welcome />, document.getElementById("root"));
