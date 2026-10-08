import { Link, useLocation } from "react-router"
import { NavigationMenuItem, NavigationMenuLink } from "@radix-ui/react-navigation-menu"
import { NavigationMenu, NavigationMenuList } from "../ui/navigation-menu"
import { cn } from "cn";

export const CustomMenu = () => {
    const { pathname } = useLocation();

    const isActive = (path: string) => {
        return pathname === path;
    }

    return (
        <NavigationMenu className="py-10">
            <NavigationMenuList>
                {/* Home */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={cn(isActive('/') && 'bg-slate-200', 'rounded-md p-2')}>
                        <Link to="/">Inicio</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                {/* Search */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={cn(isActive('/search') && 'bg-slate-200', 'rounded-md p-2')}>
                        <Link to="/search">Buscar superhéroes</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

    )
}
