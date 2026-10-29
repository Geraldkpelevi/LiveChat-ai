
import { useCallback, useMemo } from "react";
import {
  useLocation,
  useNavigate as useRouterNavigate,
} from "react-router-dom";
import { navigationItems } from "../config/navigation";

export default function useNavigation() {
  const location = useLocation();
  const routerNavigate = useRouterNavigate();

  const activeItem = useMemo(
    () =>
      navigationItems.find(
        (item) =>
          location.pathname === item.path ||
          location.pathname.startsWith(`${item.path}/`),
      ) ?? null,
    [location.pathname],
  );

  const navigate = useCallback(
    (pageId, options) => {
      const item = navigationItems.find(
        (navigationItem) => navigationItem.id === pageId,
      );

      if (item) {
        routerNavigate(item.path, options);
      }
    },
    [routerNavigate],
  );

  const isActive = useCallback(
    (pageId) =>
      navigationItems.some(
        (item) =>
          item.id === pageId &&
          (location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`)),
      ),
    [location.pathname],
  );

  const resetNavigation = useCallback(() => {
    routerNavigate("/messages", { replace: true });
  }, [routerNavigate]);

  return {
    activePage: activeItem?.id ?? null,
    activeItem,
    pathname: location.pathname,
    navigate,
    isActive,
    resetNavigation,
  };
}
