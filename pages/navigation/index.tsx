import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowRotateRight,
  faChevronLeft,
  faChevronRight,
  faPlus,
  faTimes,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { FC, useMemo } from "react";
import { render } from "react-dom";
import NavigationStore, { NavigationContext, useNavigation } from "./stores";
import Tabs from "./tabs";
import { useCss } from "react-use";
import { generateBGHex } from "../../utils/color";
import classNames from "classnames";
import Search from "./search";
import "./main.scss";

const NavigationIcon: FC<{
  icon: IconProp;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ icon, onClick, disabled }) => {
  const navigation = useNavigation();
  const color = useMemo(
    () => generateBGHex(navigation.focusedTab?.color, 0),
    [navigation.focusedTab?.color]
  );
  const hoverColor = useMemo(
    () => generateBGHex(navigation.focusedTab?.color, 0.06),
    [navigation.focusedTab?.color]
  );
  const className = useCss({
    color: color.text,
    "&:hover": {
      "background-color": hoverColor.background,
      color: hoverColor.text,
      "&:disabled": {
        color: color.disabled,
      },
    },
    "&:disabled": {
      color: color.disabled,
    },
  });
  return (
    <button
      onClick={onClick}
      className={classNames({
        "h-8 w-9 rounded-lg flex justify-center items-center bg-transparent cursor-click":
          true,
        "hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 disabled:text-neutral-400":
          true,
        "dark:hover:bg-neutral-900 dark:active:bg-neutral-800 dark:text-neutral-200 dark:disabled:text-neutral-600":
          !navigation.focusedTab?.color,
        [className]: !!navigation.focusedTab?.color,
      })}
      disabled={disabled}
    >
      <FontAwesomeIcon className="cursor-click" icon={icon} />
    </button>
  );
};

export const useColor = () => {
  const navigation = useNavigation();
  const color = useMemo(
    () => generateBGHex(navigation.focusedTab?.color, 0.2),
    [navigation.focusedTab?.color]
  );
  const className = useCss({
    "background-color": color.background,
    color: color.text,
    "&:focus": {
      "--tw-ring-opacity": 1,
      "--tw-ring-color": color.background,
      "--tw-ring-offset-color": navigation.focusedTab?.color,
    },
    "&::placeholder": {
      color: color.placeholder,
    },
  });
  return className;
};

const Navigation = observer(() => {
  const navigation = useNavigation();

  return (
    <div
      className="bg-white dark:bg-black"
      style={{
        backgroundColor: navigation.focusedTab?.color,
      }}
    >
      <div
        className={classNames({
          "p-2 w-full h-12 relative drag": true,
        })}
      >
        <Search />
        <div className="w-full pl-20 flex items-center justify-between z-10">
          <div className="flex no-drag">
            <NavigationIcon
              icon={faChevronLeft}
              disabled={!navigation.focusedTab?.canNavigateBackward}
              onClick={() => navigation.focusedTab?.navigateBackward()}
            />
            <NavigationIcon
              icon={faChevronRight}
              disabled={!navigation.focusedTab?.canNavigateForward}
              onClick={() => navigation.focusedTab?.navigateForward()}
            />
            <NavigationIcon
              icon={
                navigation.focusedTab?.loading ? faTimes : faArrowRotateRight
              }
              onClick={() =>
                navigation.focusedTab?.loading
                  ? navigation.focusedTab.cancel()
                  : navigation.focusedTab?.reload()
              }
            />
          </div>
          <div className="no-drag">
            <NavigationIcon
              icon={faPlus}
              onClick={() => window.photon.createTab()}
            />
          </div>
        </div>
      </div>
      <Tabs />
    </div>
  );
});

export default render(
  <NavigationContext.Provider value={new NavigationStore()}>
    <Navigation />
  </NavigationContext.Provider>,
  document.getElementById("root")
);
