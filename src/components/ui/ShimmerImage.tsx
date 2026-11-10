import { useState } from "react";
import type { ImgHTMLAttributes } from "react";
import Skeleton from "./Skeleton";

export default function ShimmerImage({
  src,
  onLoad,
  onError,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState<string>();
  const [failed, setFailed] = useState<string>();
  return (
    <span className={`shimmer-image${loaded === src ? " is-loaded" : ""}`}>
      {failed !== src ? (
        <>
          <img
            {...props}
            src={src}
            onLoad={(event) => {
              setLoaded(src);
              onLoad?.(event);
            }}
            onError={(event) => {
              setFailed(src);
              onError?.(event);
            }}
          />
          {loaded !== src && <Skeleton className="image-skeleton" />}
        </>
      ) : (
        <span className="image-unavailable">Image unavailable</span>
      )}
    </span>
  );
}
