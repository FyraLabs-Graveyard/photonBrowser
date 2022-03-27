import { RootObject } from "@fyralabs/photon-suggest/dist/engines/ddg";

const Software = (instantAnswer: RootObject) => {
  return (
    <>
      <div className="p-4 flex items-center gap-1 font-medium cursor-pointer">
        {instantAnswer.Image && (
          <img
            className="w-4 h-4 mr-1 cursor-pointer aspect-square object-contain"
            src={`https://duckduckgo.com${instantAnswer.Image}`}
            alt={instantAnswer.Heading}
          />
        )}
        <h1 className="text-sm cursor-pointer">{instantAnswer.Heading}</h1>
      </div>
      <hr className="border-neutral-100 dark:border-neutral-800" />
    </>
  );
};

export default Software;
