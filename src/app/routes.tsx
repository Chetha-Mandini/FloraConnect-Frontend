import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import AppLayout from "./AppLayout";
import RouteLayout from "./RouteLayout";
import NotFoundPage from "../pages/NotFoundPage";
import PlaceholderPage from "../pages/PlaceholderPage";
import HomePage from "../pages/home/HomePage";
import CommunityPage from "../pages/CommunityPage";

import FlowerCatalogueRoute from "../pages/FlowerCatalogueRoute";

export const routeObjects: RouteObject[] = [
  {
    element: <RouteLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "super-admin",
        lazy: async () => {
          const { default: Dashboard } =
            await import("../pages/AdminDashboard");
          return { element: <Dashboard superAdmin /> };
        },
      },
      {
        path: "admin",
        lazy: async () => ({
          Component: (await import("../pages/AdminDashboard")).default,
        }),
      },
      {
        path: "account",
        lazy: async () => ({
          Component: (await import("../pages/AccountPage")).default,
        }),
      },
      {
        path: "verify-email",
        lazy: async () => ({
          Component: (await import("../pages/VerifyEmailPage")).default,
        }),
      },
      {
        path: "register",
        lazy: async () => ({
          Component: (await import("../pages/Registation")).default,
        }),
      },
      {
        path: "login",
        lazy: async () => ({
          Component: (await import("../pages/LoginPage")).default,
        }),
      },
      {
        element: <AppLayout />,
        children: [
          {
            path: "growers",
            element: (
              <CommunityPage
                title="Growers"
                description="Connect with Sri Lanka’s flower growing community."
                message="No verified grower profiles have been published yet."
              />
            ),
          },
          {
            path: "events",
            element: (
              <CommunityPage
                title="Events"
                description="Flower exhibitions, grower workshops and community gatherings."
                message="No upcoming events have been published yet. Verified dates and registration details will appear here when available."
              />
            ),
          },
          {
            path: "contact",
            element: (
              <CommunityPage
                title="Contact"
                description="Get in touch with FloraConnect."
                message="Verified contact details and social channels have not been published yet."
              />
            ),
          },
          {
            path: "privacy",
            element: (
              <CommunityPage
                title="Privacy Policy"
                description="Your privacy matters to FloraConnect."
                message="The platform’s privacy policy has not been published yet. Account registration is not currently available."
              />
            ),
          },
          {
            path: "terms",
            element: (
              <CommunityPage
                title="Terms of Service"
                description="Using FloraConnect."
                message="The platform’s terms of service have not been published yet. Membership and transactions are not currently available."
              />
            ),
          },
          {
            path: "flowers",
            element: <FlowerCatalogueRoute />,
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
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routeObjects);
