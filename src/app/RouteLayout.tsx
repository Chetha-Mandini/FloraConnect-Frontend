import { useEffect } from "react";
import { Outlet, useLocation, useNavigation } from "react-router-dom";
import { RoutePending } from "./RouteState";

export default function RouteLayout() {
  const { pathname } = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return navigation.state === "loading" ? <RoutePending /> : <Outlet />;
}
