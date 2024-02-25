export default function convertDates(date) {
  return date?.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}
