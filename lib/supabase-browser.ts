import { createClient } from "@supabase/supabase-js";

// Used by the admin pages in the browser. It keeps the admin logged in,
// and Supabase only allows writes from a logged-in user.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
