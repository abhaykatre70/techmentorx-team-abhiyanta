
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gynintzvraqfdjsbmoao.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bmludHp2cmFxZmRqc2Jtb2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDI3NjQsImV4cCI6MjA4NTk3ODc2NH0.U2gjPBC4PDHte-12PvWYMgYmGErAxN85ghjyIDN86JY'

export const supabase = createClient(supabaseUrl, supabaseKey)
