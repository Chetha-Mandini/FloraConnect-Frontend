export default function BotanicalBranch({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 150 230"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 230C33 180 72 104 88 14"
        stroke="currentColor"
        strokeWidth="2"
      />
      <g fill="currentColor">
        <path d="M35 192C0 183 4 150 3 139c28 10 38 25 32 53Z" />
        <path d="M41 174c8-31 36-42 61-40-12 25-30 38-61 40Z" />
        <path d="M51 151C18 137 22 108 20 95c27 14 39 30 31 56Z" />
        <path d="M59 132c12-34 38-44 64-42-14 24-31 41-64 42Z" />
        <path d="M70 105C39 85 47 58 48 41c23 18 32 36 22 64Z" />
        <path d="M77 83c12-34 38-41 64-43-13 25-33 40-64 43Z" />
        <path d="M85 52C65 32 74 13 82 0c13 17 16 34 3 52Z" />
        <path d="M24 214c14-27 40-29 66-25-20 20-40 28-66 25Z" />
      </g>
    </svg>
  );
}
