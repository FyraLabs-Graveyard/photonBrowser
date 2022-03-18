import { Icon, RootObject } from "@getskye/suggest/dist/engines/ddg";

const Company = (instantAnswer: RootObject) => {
  const companyResult = instantAnswer.Results[0] as {
    FirstURL?: string;
    Icon?: Icon;
  };
  return (
    <>
      <div
        className="p-4 flex items-center gap-1 font-medium cursor-pointer"
        onClick={() =>
          companyResult.FirstURL && window.skye.loadURL(companyResult.FirstURL)
        }
      >
        {companyResult.Icon && (
          <img
            className="w-4 h-4 mr-1 cursor-pointer"
            src={`https://duckduckgo.com${companyResult.Icon.URL}`}
            alt={instantAnswer.Heading}
          />
        )}
        <h1 className="text-sm cursor-pointer">{instantAnswer.Heading}</h1>
        <a className="text-xs text-neutral-500">
          -{" "}
          {companyResult?.FirstURL
            ? new URL(companyResult.FirstURL).hostname
            : ""}
        </a>
      </div>
      <hr className="border-neutral-100 dark:border-neutral-800" />
    </>
  );
};

export default Company;
