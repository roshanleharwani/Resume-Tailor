import os
from dotenv import load_dotenv

load_dotenv()


print("SUPABASE_URL:", repr(os.getenv("SUPABASE_URL")))
print("SUPABASE_SERVICE_ROLE_KEY:", repr(os.getenv("SUPABASE_SERVICE_ROLE_KEY")))
