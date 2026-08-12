// Supabase Configuration
const SUPABASE_URL = 'https://kfuleydvwacseuvcxsgk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wzpP91P_XCyHSa0jAlLUyw_CGz26P2w';

// Initialize Supabase Client
// This requires the Supabase JS library to be included in the HTML file:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
