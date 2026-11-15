import { useState } from "react";
import { UserRound } from "lucide-react";

export default function GrowerAvatar({
  name,
  image,
  className = "",
}: {
  name: string;
  image: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!image || failed) {
    return (
      <div
        className={`grower-avatar grower-avatar-fallback ${className}`.trim()}
        role="img"
        aria-label={`${name} profile photo unavailable`}
      >
        <UserRound aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      className={`grower-avatar ${className}`.trim()}
      src={image}
      alt={`${name}, flower grower`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
