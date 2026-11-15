import { createBrowserRouter, Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import RouteLayout from "./RouteLayout";
import PublicLayout from "../components/layout/PublicLayout";
import NotFoundPage from "../pages/NotFoundPage";
import PlaceholderPage from "../pages/PlaceholderPage";
import HomePage from "../pages/home/HomePage";
import CommunityPage from "../pages/CommunityPage";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/Registation";
import FlowerCatalogueRoute from "../pages/FlowerCatalogueRoute";
import GrowerDirectoryDetailPlaceholder from "../pages/GrowerDirectoryDetailPlaceholder";
import {
  loadSuperAdmin,
  loadPlatformAdmin,
  loadAccount,
} from "./account-routes";
import { RouteFailure, RoutePending } from "./RouteState";

export const routeObjects: RouteObject[] = [
  {
    element: <RouteLayout />,
    HydrateFallback: RoutePending,
    errorElement: <RouteFailure />,
    children: [
      {
        path: "super-admin/*",
        element: <Navigate to="/admin" replace />,
      },
      {
        path: "admin/*",
        lazy: async () => ({
          Component: (await loadSuperAdmin()).default,
        }),
      },
      {
        path: "platform-admin",
        lazy: async () => ({
          Component: (await loadPlatformAdmin()).default,
        }),
      },
      {
        path: "account",
        lazy: async () => ({
          Component: (await loadAccount()).default,
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
        element: <RegistrationPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        element: <PublicLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
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
            path: "growers/:id",
            element: <GrowerDirectoryDetailPlaceholder type="grower" />,
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
            path: "flowers/:id",
            element: <GrowerDirectoryDetailPlaceholder type="flower" />,
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
            path: "profile",
            element: (
              <PlaceholderPage
                title="Profile"
                description="Your FloraConnect member profile."
                emptyMessage="Member profiles are not available in this preview. No account data is collected."
              />
            ),
          },
          {
            path: "logout",
            element: (
              <PlaceholderPage
                title="Logout"
                description="Sign out of FloraConnect."
                emptyMessage="Sign-out is a placeholder in this preview; no authentication session is active."
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
