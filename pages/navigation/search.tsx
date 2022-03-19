import { faSearch } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { useColor } from ".";
import { useNavigation } from "./stores";

const Search = observer(() => {
  const navigation = useNavigation();
  const className = useColor();

  const debouncedUpdateSearchQuery = useMemo(
    () =>
      navigation.focusedTab &&
      debounce(navigation.focusedTab.updateSearchQuery, 500),
    [navigation.focusedTab]
  );

  useEffect(() => {
    return () => {
      debouncedUpdateSearchQuery?.cancel();
    };
  }, [debouncedUpdateSearchQuery]);

  return (
    <div className="bg-transparent absolute top-0 left-0 w-[28rem] max-w-xl pr-1 pl-1 right-0 bottom-0 ml-auto mr-auto flex justify-center items-center z-0 overflow-hidden">
      <div className="relative w-full">
        <span className="absolute left-0 top-0 inset-y-0 flex items-center pl-3 text-neutral-400">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <input
          placeholder={
            !!navigation.focusedTab?.input?.length
              ? navigation.focusedTab.input
              : "Search DuckDuckGo or enter address"
          }
          className={classNames({
            "bg-neutral-100 text-black ring-neutral-100 ring-offset-white":
              true,
            "dark:bg-neutral-900 dark:text-white dark:ring-neutral-900 placeholder:text-neutral-500 dark:ring-offset-black":
              true,
            " pl-10 pr-4 py-2 rounded-lg w-full text-sm no-drag h-8 outline-none focus:ring-2 ring-offset-2":
              true,
            [className]: !!navigation.focusedTab?.color,
          })}
          value={navigation.focusedTab?.input ?? ""}
          onKeyDown={(event) => {
            if (event.key === "Enter" && navigation.focusedTab) {
              navigation.focusedTab.setInput("");
              if (!!event.currentTarget?.value?.length) {
                debouncedUpdateSearchQuery?.cancel();
                navigation.focusedTab?.load(event.currentTarget.value);
              }

              event.currentTarget.blur();
            }
          }}
          onFocus={(event) => {
            if (!!event.target?.value?.length && navigation.focusedTab) {
              navigation.focusedTab.setInput(event.target.value ?? "");
              navigation.focusedTab.updateSearchQuery(event.target.value);
            }
          }}
          onChange={(event) => {
            if (!navigation.focusedTab) return;
            if (debouncedUpdateSearchQuery)
              debouncedUpdateSearchQuery(event.target.value);
            navigation.focusedTab.setInput(event.target.value ?? "");
            event.preventDefault();
          }}
          onBlur={() => window.skye.hideSearch}
        />
      </div>
    </div>
  );
});

export default Search;
