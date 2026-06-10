import { redirect } from "@/i18n/navigation";

/** LAAX 型: コース・マップは /map に統合 */
export default function CoursesPage() {
  redirect("/map");
}
