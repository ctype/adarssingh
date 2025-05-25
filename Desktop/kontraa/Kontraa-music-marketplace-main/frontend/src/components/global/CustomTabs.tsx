import { Tabs } from "@chakra-ui/react";

interface ICustomTabsInterface {
  items: {
    trigger: string | React.ReactNode;
    children: string | React.ReactNode;
    value: string;
    onclick: () => void;
  }[];
  defaultValue: string;
}

export default function CustomTabs({
  items,
  defaultValue,
}: ICustomTabsInterface) {
  return (
    <Tabs.Root variant="line" size={"lg"} defaultValue={defaultValue}>
      <Tabs.List>
        {items.map((item) => (
          <Tabs.Trigger
            key={item.value}
            onClick={item.onclick}
            value={item.value}
            color={"white"}
            backgroundColor={"transparent"}
            _selected={{ backgroundColor: "gray.900" }}
          >
            {item.trigger}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {items.map((item) => (
        <Tabs.Content key={item.value} value={item.value}>
          {item.children}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
