from fastapi import APIRouter, HTTPException, Request
from app.db.supabase_client import supabase

router = APIRouter()

def require_org_id(request: Request) -> str:
    org_id = request.headers.get("x-org-id")
    if not org_id:
        raise HTTPException(status_code=403, detail="Missing organization.")
    return org_id

@router.get("/volunteers")
def get_volunteers(request: Request):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")

        org_id = require_org_id(request)

        response = (
            supabase
            .table("volunteers")
            .select("*")
            .eq("org_id", org_id)
            .order("created_at", desc=True)
            .execute()
        )

        return response.data

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))