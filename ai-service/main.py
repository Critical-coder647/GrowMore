from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="GrowMore AI Matching Service")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Investor(BaseModel):
    id: str
    name: str
    email: str
    industries: List[str] = []
    keywords: List[str] = []
    budget_min: float = 0
    budget_max: float = 0
    preferred_stages: List[str] = []

class Startup(BaseModel):
    id: str
    name: str
    industry: List[str] = []
    stage: str = ""
    funding_min: float = 0
    funding_max: float = 0
    keywords: List[str] = []
    description: str = ""

class MatchRequest(BaseModel):
    startup: Startup
    investors: List[Investor]

class MatchResult(BaseModel):
    investor_id: str
    investor_name: str
    investor_email: str
    score: int
    reason: str

class MatchResponse(BaseModel):
    startup_id: str
    matches: List[MatchResult]

def calculate_jaccard_similarity(set1: List[str], set2: List[str]) -> float:
    """Calculate Jaccard similarity between two lists"""
    if not set1 or not set2:
        return 0.0
    s1 = set([item.lower() for item in set1 if item])
    s2 = set([item.lower() for item in set2 if item])
    if not s1 or not s2:
        return 0.0
    intersection = len(s1.intersection(s2))
    union = len(s1.union(s2))
    return intersection / union if union > 0 else 0.0

def compute_match_score(startup: Startup, investor: Investor) -> tuple[int, str]:
    """
    Compute AI match score between startup and investor
    Returns: (score, reason)
    """
    reasons = []
    
    # Industry match (50% weight)
    industry_score = 0
    if startup.industry and investor.industries:
        industry_overlap = set([i.lower() for i in startup.industry]).intersection(
            set([i.lower() for i in investor.industries])
        )
        if industry_overlap:
            industry_score = 100
            reasons.append(f"Industry match: {', '.join(industry_overlap)}")
        else:
            industry_score = 0
    
    # Budget match (20% weight)
    budget_score = 0
    avg_funding = (startup.funding_min + startup.funding_max) / 2 if startup.funding_max > 0 else startup.funding_min
    if investor.budget_min <= avg_funding <= investor.budget_max:
        budget_score = 100
        reasons.append(f"Funding requirement (${avg_funding:,.0f}) fits investor budget")
    elif avg_funding > 0:
        budget_score = 50
        reasons.append(f"Partial budget alignment")
    
    # Stage match (15% weight)
    stage_score = 0
    if startup.stage and investor.preferred_stages:
        if startup.stage in investor.preferred_stages:
            stage_score = 100
            reasons.append(f"Stage match: {startup.stage}")
        else:
            stage_score = 0
    
    # Keywords similarity (15% weight)
    keyword_score = 0
    if startup.keywords and investor.keywords:
        jaccard = calculate_jaccard_similarity(startup.keywords, investor.keywords)
        keyword_score = jaccard * 100
        if jaccard > 0.3:
            matching_keywords = set([k.lower() for k in startup.keywords]).intersection(
                set([k.lower() for k in investor.keywords])
            )
            reasons.append(f"Keyword overlap: {', '.join(list(matching_keywords)[:3])}")
    
    # Calculate weighted score
    total_score = (
        industry_score * 0.5 +
        budget_score * 0.2 +
        stage_score * 0.15 +
        keyword_score * 0.15
    )
    
    # Generate reason string
    reason = " • ".join(reasons) if reasons else "Limited matching criteria"
    
    return int(total_score), reason

@app.get("/")
def read_root():
    return {
        "status": "GrowMore AI Service Running",
        "version": "1.0.0",
        "endpoints": ["/match", "/health"]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/match", response_model=MatchResponse)
def match_startup_investors(request: MatchRequest):
    """
    Match a startup with investors using AI-based scoring
    """
    try:
        matches = []
        
        for investor in request.investors:
            score, reason = compute_match_score(request.startup, investor)
            
            matches.append(MatchResult(
                investor_id=investor.id,
                investor_name=investor.name,
                investor_email=investor.email,
                score=score,
                reason=reason
            ))
        
        # Sort by score descending
        matches.sort(key=lambda x: x.score, reverse=True)
        
        return MatchResponse(
            startup_id=request.startup.id,
            matches=matches
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
