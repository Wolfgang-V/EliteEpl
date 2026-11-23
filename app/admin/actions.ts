"use server";

import { updateTag } from "next/cache";

// Called after every admin save, so the public pages show the change straight away
export async function refreshSite() {
  updateTag("league");
}
