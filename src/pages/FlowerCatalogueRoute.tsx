import { lazy, Suspense } from "react";
import FlowerCatalogueSkeleton from "../features/flowers/FlowerCatalogueSkeleton";

const FlowerCataloguePage = lazy(() => import("./FlowerCataloguePage"));

export default function FlowerCatalogueRoute() {
  return (
    <Suspense fallback={<FlowerCatalogueSkeleton />}>
      <FlowerCataloguePage />
    </Suspense>
  );
}
