export const readable = (value?: string) =>
  value ? value.toLowerCase().replaceAll("_", " ") : "—";
export const dateLabel = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        timeZone: "Asia/Colombo",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
