import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import AppLayout from "./AppLayout";
import RouteLayout from "./RouteLayout";
import NotFoundPage from "../pages/NotFoundPage";
import PlaceholderPage from "../pages/PlaceholderPage";
import HomePage from "../pages/home/HomePage";

export const routeObjects: RouteObject[] = [
  {
    element: <RouteLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        element: <AppLayout />,
        children: [
          {
            path: "flowers",
            element: (
              <PlaceholderPage
                title="Flowers"
                description="Discover flower varieties and growing inspiration from across Sri Lanka."
                emptyMessage="The flower directory is being prepared. Explore the sample flowers on the home page in the meantime."
              />
            ),
          },
          {
            path: "associations",
            element: (
              <PlaceholderPage
                title="Associations"
                description="Find flower associations and local chapters throughout Sri Lanka."
                emptyMessage="The verified association directory is coming soon."
              />
            ),
          },
          {
            path: "announcements",
            element: (
              <PlaceholderPage
                title="Announcements"
                description="Keep up with community updates and relevant opportunities."
                emptyMessage="There are no announcements yet. Check back as FloraConnect grows."
              />
            ),
          },
          {
            path: "login",
            element: (
              <PlaceholderPage
                title="Login"
                description="Welcome back to FloraConnect."
                emptyMessage="Member login is coming soon. This preview does not collect account details."
              />
            ),
          },
          {
            path: "register",
            element: (
              <PlaceholderPage
                title="Register"
                description="Join growers, associations, buyers and flower enthusiasts."
                emptyMessage="Member registration is coming soon. This preview does not collect account details."
              />
            ),
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routeObjects);
