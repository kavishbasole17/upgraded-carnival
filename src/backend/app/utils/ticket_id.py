from datetime import datetime
import uuid

def generate_ticket_id() -> str:
    year = datetime.now().year
    suffix = str(uuid.uuid4().int)[:6]
    return f"NGO-{year}-{suffix}"
