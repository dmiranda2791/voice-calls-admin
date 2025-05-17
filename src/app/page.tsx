import { redirect } from "next/navigation"

export default function HomePage() {
  redirect("/calls")

  // This won't be rendered, but is needed for TypeScript
  return null
}
