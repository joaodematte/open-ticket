export function getUserNameInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
}
