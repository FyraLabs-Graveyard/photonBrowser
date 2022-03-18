import { RootObject } from "@getskye/suggest/dist/engines/ddg";

const Abstract = (instantAnswer: RootObject) => {
  return (
    <div
      className="px-4 mt-4 cursor-pointer"
      onClick={() =>
        instantAnswer.AbstractURL &&
        window.skye.loadURL(instantAnswer.AbstractURL)
      }
    >
      <div className="flex items-center gap-1 font-medium cursor-pointer">
        <h1 className="text-sm cursor-pointer">{instantAnswer.Heading}</h1>
        <a className="text-xs text-neutral-500 after:content-['_↗']">
          - {instantAnswer.AbstractSource}
        </a>
      </div>
      {!!instantAnswer.AbstractText.length && (
        <p className="h-8 overflow-hidden text-xs">
          {instantAnswer.AbstractText}
        </p>
      )}
    </div>
  );
};

export default Abstract;
