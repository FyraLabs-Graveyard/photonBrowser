import { render } from "react-dom";

const Search = () => {
  return (
    <div className="drag w-full h-full p-1 bg-transparent">
      <input
        placeholder="Search or type in a URL"
        className="bg-transparent px-4 py-2 rounded-lg w-full h-full text-sm"
      />
    </div>
  );
};

export default render(<Search />, document.getElementById("root"));
