import { Icon, RootObject } from "@fyralabs/photon-suggest/dist/engines/ddg";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect } from "react";
import { render } from "react-dom";
import SearchStore, { SearchContext, useSearch } from "./stores";
import { faSearch } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Company from "./suggestions/company";
import Abstract from "./suggestions/abstract";
import Software from "./suggestions/software";
import { useElementSize } from "usehooks-ts";

const Search = observer(() => {
  const search = useSearch();
  const [searchRef, { height }] = useElementSize();
  console.log(search.instantAnswer);

  useEffect(() => {
    window.photon.resize(height + 40);
  }, [height]);

  return (
    <div className="flex flex-1 justify-center w-screen px-auto">
      <div
        className="mt-1 bg-white dark:bg-black rounded-lg shadow-lg w-[440px] max-h-[480px]"
        ref={searchRef}
      >
        {search?.instantAnswer?.Entity === "company" ? (
          <Company {...search.instantAnswer} />
        ) : search?.instantAnswer?.Entity === "software" ? (
          <Software {...search.instantAnswer} />
        ) : (
          <></>
        )}

        {!!search?.instantAnswer?.AbstractSource?.length && (
          <Abstract {...search.instantAnswer} />
        )}
        {!!search.searchEngineSuggestions.length && (
          <div className="p-4">
            <h2 className="text-xs text-black dark:text-white pb-1">
              DuckDuckGo
            </h2>
            <div className="flex flex-col gap-1">
              {search.searchEngineSuggestions.map((result, index) => (
                <Fragment key={index}>
                  {index !== 0 && (
                    <hr className="border-neutral-200 dark:border-neutral-800" />
                  )}
                  <a
                    className="py-1 cursor-pointer flex items-center gap-2"
                    onClick={() =>
                      window.photon.loadURL(
                        `https://duckduckgo.com?q=${encodeURIComponent(result)}`
                      )
                    }
                  >
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="text-neutral-500"
                    />
                    {result}
                  </a>
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default render(
  <SearchContext.Provider value={new SearchStore()}>
    <Search />
  </SearchContext.Provider>,
  document.getElementById("root")
);
