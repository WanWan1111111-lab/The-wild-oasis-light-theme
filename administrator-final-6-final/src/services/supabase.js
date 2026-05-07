import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://fqllpewsrjixwghdavws.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxbGxwZXdzcmppeHdnaGRhdndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDI4MTAsImV4cCI6MjA4NjAxODgxMH0.HDo72Mpui92phPx6eVnPzYQ-p061ANxslthm4-ME94c"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;
export { supabaseUrl };

