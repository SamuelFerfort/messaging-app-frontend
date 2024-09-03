export function truncateAbout(about, maxLength = 30) {
  if (!about) return "No status update";

  return about.length > maxLength
    ? about.substring(0, maxLength) + "..."
    : about;
}

export function truncateMessage(message, maxLength = 30) {
  if (!message) return "Send your first message";
  if (message.startsWith("http") && message.includes("cloudinary")) {
    return "Sent an image";
  }
  return message.length > maxLength
    ? message.substring(0, maxLength) + "..."
    : message;
}
