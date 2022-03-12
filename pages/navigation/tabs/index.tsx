import { Reorder } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useNavigation } from "../stores";
import Tab from "./tab";

const Tabs = observer(() => {
  const navigation = useNavigation();
  if (navigation.tabs.length <= 1) return <></>;
  return (
    <Reorder.Group
      axis="x"
      as="div"
      className="flex pb-2 px-4 gap-2 h-10 overflow-x-auto"
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
