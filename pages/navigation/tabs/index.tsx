import classNames from "classnames";
import { Reorder } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useCss } from "react-use";
import { useNavigation } from "../stores";
import Tab from "./tab";

const Tabs = observer(() => {
  const navigation = useNavigation();
  const className = useCss({
    "&::-webkit-scrollbar": {
      display: "none",
    },
  });
  if (navigation.tabs.length <= 1) return <></>;
  return (
    <Reorder.Group
      axis="x"
      as="div"
      className={classNames({
        "flex pb-2 px-4 gap-2 h-10 overflow-x-auto": true,
        [className]: true,
      })}
      ref={navigation.ref}
      values={navigation.tabs}
      onReorder={(tabs) => navigation.setTabs(tabs)}
      layoutScroll
    >
      {navigation.tabs.map(({ id }) => (
        <Tab id={id} key={id} />
      ))}
    </Reorder.Group>
  );
});

export default Tabs;
