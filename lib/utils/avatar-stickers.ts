export type DashboardRole = "student" | "mentor" | "investor" | "admin";

const ROLE_STICKERS: Record<DashboardRole, string> = {
  student: "/stickers/student-avatar-sticker.svg",
  mentor: "/stickers/mentor-avatar-sticker.svg",
  investor: "/stickers/investor-avatar-sticker.svg",
  admin: "/stickers/admin-avatar-sticker.svg",
};

export function getAvatarStickerForRole(role?: string | null) {
  switch (role) {
    case "mentor":
      return ROLE_STICKERS.mentor;
    case "investor":
      return ROLE_STICKERS.investor;
    case "admin":
      return ROLE_STICKERS.admin;
    case "student":
    default:
      return ROLE_STICKERS.student;
  }
}
