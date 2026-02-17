import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    import.meta.env.VITE_URL_FOR_SUPABASE, 
    import.meta.env.VITE_ANON_KEY_FOR_SUPABASE
);

// this variable, supabase, is a client that enables us to
// interact with our supabase backend.
// by using supabase.auth, we can access all auth-related stuff
// by using supabase.from(), we can access the database
// by using supabase.storage, we can access file storage 
// (although idk what file storage I would need in Supabase!)