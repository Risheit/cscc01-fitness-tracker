import { redirect, RedirectType } from "next/navigation";

export default function Root() {
  redirect('/home', RedirectType.replace);
}