from fastapi import APIRouter, HTTPException, Request
from app.models.schemas import TicketInput, TicketResponse
from app.services.rule_engine import rule_score
from app.services.llm_engine import llm_priority
from app.services.fusion_engine import fuse
from app.utils.ticket_id import generate_ticket_id
from app.db.supabase_client import supabase
from loguru import logger
from typing import Optional

router = APIRouter()

def get_org_id(request: Request) -> Optional[str]:
    """Extract org_id from the X-Org-Id request header."""
    return request.headers.get("x-org-id")

@router.post('/create-ticket', response_model=TicketResponse)
def create_ticket(ticket: TicketInput, request: Request):
    try:
        org_id = get_org_id(request)
        rule = rule_score(ticket.description)
        llm = llm_priority(ticket.description)

        fusion = fuse(rule['score'], llm.get('priority_score', 0))

        ticket_id = generate_ticket_id()

        payload = {
            "ticket_id": ticket_id,
            "raised_by": ticket.raised_by,
            "phone_no": ticket.phone_no,
            "district": ticket.location.district,
            "village": ticket.location.village,
            "latitude": ticket.location.lat,
            "longitude": ticket.location.lng,
            "description": ticket.description,
            "category": llm.get('category', 'Unknown'),
            "priority": fusion['priority'],
            "priority_score": fusion['final_score'],
            "rule_score": rule['score'],
            "llm_score": llm.get('priority_score', 0),
            "llm_reason": llm.get('reason', 'None'),
            "status": "Open",
            "created_at": ticket.created_at.isoformat(),
            "volunteer_assigned": False,
            "org_id": org_id,
        }

        if supabase:
            supabase.table("tickets").insert(payload).execute()
        else:
            logger.warning("Supabase client not initialized, skipping DB insert.")

        return payload

    except Exception as e:
        logger.error(f"Error creating ticket: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tickets')
def get_tickets(request: Request):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        org_id = get_org_id(request)
        query = supabase.table("tickets").select("*")
        
        if org_id:
            query = query.eq("org_id", org_id)
        
        response = query.order("created_at", desc=True).execute()
        return response.data

    except Exception as e:
        logger.error(f"Error fetching tickets: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel
class StatusUpdate(BaseModel):
    status: str

@router.patch('/tickets/{ticket_id}/status')
def update_ticket_status(ticket_id: str, payload: StatusUpdate, request: Request):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        org_id = get_org_id(request)
        query = supabase.table("tickets").update({"status": payload.status}).eq("ticket_id", ticket_id)
        
        if org_id:
            query = query.eq("org_id", org_id)
        
        response = query.execute()
        return {"message": "Status updated successfully", "data": response.data}
    except Exception as e:
        logger.error(f"Error updating status for {ticket_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete('/tickets/{ticket_id}')
def delete_ticket(ticket_id: str, request: Request):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        org_id = get_org_id(request)
        query = supabase.table("tickets").delete().eq("ticket_id", ticket_id)
        
        if org_id:
            query = query.eq("org_id", org_id)
        
        response = query.execute()
        return {"message": "Ticket deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting ticket {ticket_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

