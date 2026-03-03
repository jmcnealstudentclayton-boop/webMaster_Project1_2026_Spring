import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://zgrqkwxxfvhbweohavev.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncnFrd3h4ZnZoYndlb2hhdmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0OTY2ODUsImV4cCI6MjA4ODA3MjY4NX0.rom4Yy6tDxMVqTUdRifTIQaRJsXjThVliJhMYRK1sgQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
