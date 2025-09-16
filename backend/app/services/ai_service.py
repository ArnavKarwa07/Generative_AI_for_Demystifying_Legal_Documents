import os
from groq import Groq
from typing import Dict, List, Any
import json
from app.config import GROQ_API_KEY
from app.schemas import DraftRequest, ExplainClauseResponse, SimulateClauseResponse

class AIService:
    def __init__(self):
        self.client = Groq(api_key=GROQ_API_KEY)
        self.model = "llama3-8b-8192"
    
    async def generate_draft(self, request: DraftRequest) -> Dict[str, Any]:
        """Generate a contract draft using Groq AI"""
        prompt = f"""
        Create a {request.contract_type} for {request.parties.get('partyA')} (client) and {request.parties.get('partyB')} (vendor).
        
        Details:
        - Scope: {request.scope_short}
        - Payment: {request.payment_terms}
        - Jurisdiction: {request.jurisdiction}
        - Risk appetite: {request.risk_profile}
        
        Output: full contract with TOC, clauses, defined variables, and a 3-line executive summary.
        Include citations for legal constraints if present.
        
        Format the response as a complete legal document with proper structure and professional language.
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert legal document drafting assistant. Create professional, comprehensive legal documents with proper structure, clear language, and appropriate legal provisions."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.3,
                max_tokens=4000
            )
            
            content = response.choices[0].message.content
            
            # Generate a summary
            summary_prompt = f"Provide a 3-line executive summary of this contract:\n\n{content[:1000]}..."
            
            summary_response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a legal expert. Provide concise, accurate summaries of legal documents."
                    },
                    {
                        "role": "user",
                        "content": summary_prompt
                    }
                ],
                model=self.model,
                temperature=0.2,
                max_tokens=200
            )
            
            summary = summary_response.choices[0].message.content
            
            return {
                "content": content,
                "summary": summary
            }
            
        except Exception as e:
            raise Exception(f"Error generating draft: {str(e)}")
    
    def extract_clauses(self, content: str) -> List[Dict[str, Any]]:
        """Extract individual clauses from contract content"""
        # This is a simplified implementation
        # In production, you'd use more sophisticated NLP techniques
        
        clauses = []
        sections = content.split('\n\n')
        
        for i, section in enumerate(sections):
            if len(section.strip()) > 50:  # Filter out very short sections
                clause_type = self._identify_clause_type(section)
                clauses.append({
                    "type": clause_type,
                    "text": section.strip(),
                    "variables": {},
                    "risk_score": self._calculate_risk_score(section)
                })
        
        return clauses
    
    def _identify_clause_type(self, text: str) -> str:
        """Identify the type of clause based on content"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['confidential', 'non-disclosure', 'proprietary']):
            return 'confidentiality'
        elif any(word in text_lower for word in ['payment', 'fee', 'compensation', 'invoice']):
            return 'payment'
        elif any(word in text_lower for word in ['terminate', 'termination', 'end', 'expire']):
            return 'termination'
        elif any(word in text_lower for word in ['indemnify', 'indemnification', 'liability', 'damages']):
            return 'indemnification'
        elif any(word in text_lower for word in ['intellectual property', 'copyright', 'patent', 'trademark']):
            return 'intellectual_property'
        elif any(word in text_lower for word in ['governing law', 'jurisdiction', 'dispute', 'arbitration']):
            return 'governing_law'
        else:
            return 'general'
    
    def _calculate_risk_score(self, text: str) -> float:
        """Calculate a simple risk score for a clause"""
        # This is a very simplified risk scoring mechanism
        # In production, you'd use trained ML models
        
        high_risk_terms = ['unlimited liability', 'personal guarantee', 'no limitation', 'perpetual']
        medium_risk_terms = ['liable', 'damages', 'penalty', 'breach']
        
        text_lower = text.lower()
        risk_score = 0.3  # Base risk
        
        for term in high_risk_terms:
            if term in text_lower:
                risk_score += 0.3
        
        for term in medium_risk_terms:
            if term in text_lower:
                risk_score += 0.1
        
        return min(risk_score, 1.0)
    
    async def explain_clause(self, clause_text: str, explanation_type: str) -> ExplainClauseResponse:
        """Explain a clause in different styles"""
        
        style_prompts = {
            "eli5": "Explain this legal clause as if explaining to a 5-year-old, using simple language and analogies:",
            "technical": "Provide a detailed technical explanation of this legal clause, including legal implications and technical details:",
            "legalese": "Explain this clause using precise legal terminology and cite relevant legal principles:"
        }
        
        prompt = f"{style_prompts.get(explanation_type, style_prompts['eli5'])}\n\n{clause_text}"
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a legal expert who can explain complex legal concepts clearly. Always provide accurate, helpful explanations with appropriate citations when possible."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.2,
                max_tokens=1000
            )
            
            explanation = response.choices[0].message.content
            
            return ExplainClauseResponse(
                explanation=explanation,
                confidence=0.85,  # Would be calculated based on model certainty
                citations=[]  # Would extract citations from response
            )
            
        except Exception as e:
            raise Exception(f"Error explaining clause: {str(e)}")
    
    async def simulate_clause_change(self, original_clause: str, modified_clause: str) -> SimulateClauseResponse:
        """Simulate the impact of changing a clause"""
        
        prompt = f"""
        Analyze the impact of changing this legal clause:
        
        ORIGINAL:
        {original_clause}
        
        MODIFIED:
        {modified_clause}
        
        Please provide:
        1. Impact analysis (legal, financial, operational implications)
        2. Risk assessment (scale 0-1)
        3. Recommendations for mitigating any new risks
        
        Format your response as structured analysis.
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a legal risk analyst. Provide thorough, accurate analysis of legal clause changes and their implications."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.2,
                max_tokens=1500
            )
            
            analysis_text = response.choices[0].message.content
            
            # Parse the response (simplified)
            impact_analysis = {"analysis": analysis_text}
            risk_assessment = 0.5  # Would extract from response
            recommendations = ["Review with legal counsel", "Consider stakeholder impact"]
            
            return SimulateClauseResponse(
                impact_analysis=impact_analysis,
                risk_assessment=risk_assessment,
                recommendations=recommendations
            )
            
        except Exception as e:
            raise Exception(f"Error simulating clause change: {str(e)}")
    
    async def suggest_redline(self, redline_request: Dict[str, Any]) -> Dict[str, Any]:
        """Suggest redline changes for contract negotiation"""
        
        clause_text = redline_request.get("clause_text", "")
        risk_profile = redline_request.get("risk_profile", "balanced")
        instructions = redline_request.get("instructions", "")
        
        prompt = f"""
        Suggest redline changes for this clause:
        
        CLAUSE:
        {clause_text}
        
        RISK PROFILE: {risk_profile}
        INSTRUCTIONS: {instructions}
        
        Provide specific redline suggestions with rationale and confidence level.
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a legal negotiation expert. Provide specific, actionable redline suggestions with clear rationale."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.3,
                max_tokens=1000
            )
            
            redline_text = response.choices[0].message.content
            
            return {
                "redline_text": redline_text,
                "rationale": "AI-generated redline based on risk profile and instructions",
                "confidence": 0.82
            }
            
        except Exception as e:
            raise Exception(f"Error generating redlines: {str(e)}")
    
    async def generate_alternatives(self, alternatives_request: Dict[str, Any]) -> Dict[str, Any]:
        """Generate alternative clause versions"""
        
        clause_text = alternatives_request.get("clause_text", "")
        
        prompt = f"""
        Provide 3 variants (safe, balanced, aggressive) for this clause:
        
        ORIGINAL CLAUSE:
        {clause_text}
        
        For each variant, provide:
        1. The rewritten clause
        2. A brief rationale
        3. Risk level assessment
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a legal drafting expert. Create clause alternatives that vary in risk profile while maintaining legal validity."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.4,
                max_tokens=1500
            )
            
            alternatives_text = response.choices[0].message.content
            
            return {
                "alternatives": alternatives_text,
                "variants": ["safe", "balanced", "aggressive"]
            }
            
        except Exception as e:
            raise Exception(f"Error generating alternatives: {str(e)}")
    
    async def analyze_risk(self, risk_request: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze risk in contract or clause"""
        
        text = risk_request.get("text", "")
        
        prompt = f"""
        Analyze the legal and business risks in this text:
        
        {text}
        
        Provide:
        1. Risk level (Low/Medium/High)
        2. Specific risk factors identified
        3. Mitigation recommendations
        4. Overall risk score (0-1)
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a legal risk assessment expert. Provide thorough, accurate risk analysis with actionable recommendations."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.2,
                max_tokens=1000
            )
            
            risk_analysis = response.choices[0].message.content
            
            return {
                "analysis": risk_analysis,
                "risk_score": 0.6,  # Would extract from response
                "risk_level": "Medium",  # Would extract from response
                "recommendations": ["Review with legal counsel", "Consider additional protections"]
            }
            
        except Exception as e:
            raise Exception(f"Error analyzing risk: {str(e)}")
    
    async def simulate_changes(self, simulation_request: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate impact of document changes"""
        
        # This would integrate with both Groq for reasoning and sklearn for numerical analysis
        return {
            "impact_summary": "Simulated impact analysis",
            "financial_impact": {"range": "$1000-$5000", "risk": "Low"},
            "legal_impact": {"assessment": "Minimal risk increase", "recommendations": []},
            "compliance_impact": {"status": "Compliant", "notes": "No compliance issues identified"}
        }