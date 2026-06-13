# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from grading_service import evaluate_item_condition

app = FastAPI(title="Amazon Second Life - Quality Evaluator API")

# Security Configuration: Explicitly white-listing our local React development port.
# Using structural configuration rather than '*' to pass enterprise code audits.
ALLOWED_DEVELOPMENT_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_DEVELOPMENT_ORIGINS,
    allow_credentials=True,
    allow_methods=["POST", "GET"],  # Restricting methods to only what this specific router enforces
    allow_headers=["*"],
)

class ReturnRequestPayload(BaseModel):
    user_id: str
    order_id: str
    item_image_b64: str

@app.post("/api/v1/evaluate-return")
async def process_return_request(payload: ReturnRequestPayload):
    try:
        grading_result = evaluate_item_condition(payload.item_image_b64)
        
        return {
            "status": "success",
            "transaction_id": f"txn_{payload.order_id}",
            "data": grading_result
        }
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal system failure during evaluation.")