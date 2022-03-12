import { faCircleNotch, faTimes } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { Reorder } from "framer-motion";
import { observer } from "mobx-react-lite";
import normalizeUrl from "normalize-url";
import { FC, useMemo } from "react";
import { useCss } from "react-use";
import { generateBGHex } from "../../../utils/color";
import { useNavigation } from "../stores";

const Tab: FC<{
  id: string;
}> = observer(({ id }) => {
  const navigation = useNavigation();
  const tab = navigation.findTab(id);
  const color = useMemo(
    () => generateBGHex(navigation.focusedTab?.color, 0.1),
    [navigation.focusedTab?.color]
  );
  const activeColor = useMemo(
    () => generateBGHex(navigation.focusedTab?.color, 0.2),
    [navigation.focusedTab?.color]
  );
  const hoverColor = useMemo(
    () => generateBGHex(navigation.focusedTab?.color, 0.3),
    [navigation.focusedTab?.color]
  );

  const className = useCss({
    "background-color":
      navigation.focusedTabID === id
        ? activeColor.background
        : color.background,
    color: navigation.focusedTabID === id ? activeColor.text : color.text,
    "&:hover": {
      "background-color": hoverColor.background,
      color: navigation.focusedTabID === id ? hoverColor.text : color.text,
    },
  });

  const closeClassName = useCss({
    "&:hover": {
      "background-color": activeColor.background,
    },
  });

  if (!tab) return <></>;

  return (
    <Reorder.Item
      key={tab.id}
      value={tab}
      className={classNames({
        "justify-between p-2 w-56 rounded-lg min-w-[100px] text-xs text-gray-700 hover:bg-gray-200 flex items-center select-none":
          true,
        "bg-gray-100": navigation.focusedTabID !== id,
        "bg-gray-200": navigation.focusedTabID === id,
        [className]: !!navigation.focusedTab?.color,
      })}
      onClick={tab.focus}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        {tab.loading && <FontAwesomeIcon icon={faCircleNotch} spin />}
        <h1 className="truncate">
          {tab.title ??
            normalizeUrl(tab.url.toString(), {
              stripProtocol: true,
            })}
        </h1>
      </div>
      <button
        className={classNames({
          "w-5 h-5 min-w-[1.25rem] min-h-[1.25rem] hover:bg-gray-300 rounded":
            true,
          [closeClassName]: !!navigation.focusedTab?.color,
        })}
        onClick={(event) => {
          event.stopPropagation();
          tab.close();
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </Reorder.Item>
  );
});

export default Tab;
