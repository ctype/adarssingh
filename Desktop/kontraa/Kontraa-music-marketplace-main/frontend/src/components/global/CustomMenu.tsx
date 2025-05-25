import { PropsWithChildren } from "react";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface ICustomMenuProps {
  menus: {
    name: string;
    value: string;
    isLink: boolean;
    isDanger?: boolean;
    onClick?: () => void;
  }[];
}

export default function CustomMenu({
  children,
  menus,
}: PropsWithChildren<ICustomMenuProps>) {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="plain">{children}</Button>
      </MenuTrigger>
      <MenuContent backgroundColor={"black"}>
        {menus.map((menu) => (
          <MenuItem
            asChild
            value={menu.value}
            key={menu.value}
            color={menu.isDanger ? "fg.error" : "white"}
            width={"100%"}
            _hover={{
              bg: menu.isDanger ? "red.700/20" : "gray.800",
            }}
            onClick={menu.onClick}
          >
            {menu.isLink ? (
              <Link to={menu.value}>{menu.name}</Link>
            ) : (
              <span>{menu.name}</span>
            )}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
}
