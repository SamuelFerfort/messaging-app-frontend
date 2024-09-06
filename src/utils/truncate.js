export function truncateAbout(chat, user, maxLength = 30) {
  if (chat.isGroup) {
    const userName = `, ${user.firstName} ${user.lastName}`;

    return truncateMessage(
      chat.receiver.map((u) => `${u.firstName} ${u.lastName}`).join(", ") +
        userName,
      350
    );
  }

  const about = chat.receiver[0].about;
  if (!about) return "No status update";

  return about.length > maxLength
    ? about.substring(0, maxLength) + "..."
    : about;
}

export function truncateMessage(message, maxLength = 150) {
  if (!message) return "Send your first message";
  if (message.startsWith("http") && message.includes("cloudinary")) {
    return "Sent an image";
  }
  return message.length > maxLength
    ? message.substring(0, maxLength) + "..."
    : message;
}
