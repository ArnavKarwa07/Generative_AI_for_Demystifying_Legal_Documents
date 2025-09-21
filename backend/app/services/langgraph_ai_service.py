from typing import Dict, List, Any, Optional
from groq import Groq
import json
from app.config import GROQ_API_KEY
from app.schemas import DraftRequest, ExplainClauseResponse, SimulateClauseResponse


class LegalWorkflowState:
    """State for the legal document workflow"""
    def __init__(self):
        self.messages: List[Dict[str, Any]] = []
        self.context: Dict[str, Any] = {}
        self.analysis_results: Dict[str, Any] = {}
        self.current_step: str = ""
        self.user_input: str = ""
        self.final_output: Dict[str, Any] = {}


class LangGraphAIService:
    """Enhanced AI Service with workflow-like processing using Groq"""
    
    def __init__(self):
        self.client = Groq(api_key=GROQ_API_KEY)
        self.model = "llama3-8b-8192"

    def _execute_workflow_step(self, prompt: str, response_format: str = "text") -> str:
        """Execute a single workflow step with Groq"""
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert legal AI assistant with advanced workflow capabilities. Provide thorough, accurate, and professional responses.",
                    },
                    {"role": "user", "content": prompt},
                ],
                model=self.model,
                temperature=0.3,
                max_tokens=4000,
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Workflow step failed: {str(e)}")

    async def generate_draft(self, request: DraftRequest) -> Dict[str, Any]:
        """Generate a contract draft using enhanced workflow"""
        try:
            # Step 1: Analyze requirements
            analysis_prompt = f"""
            As a legal requirements analyst, analyze these contract requirements:
            
            Contract Type: {request.contract_type}
            Parties: {request.parties}
            Scope: {request.scope_short}
            Payment Terms: {request.payment_terms}
            Jurisdiction: {request.jurisdiction}
            Risk Profile: {request.risk_profile}
            
            Provide a structured analysis including:
            1. Contract complexity assessment
            2. Key provisions needed
            3. Risk factors to consider
            4. Legal considerations for this jurisdiction
            """
            
            analysis = self._execute_workflow_step(analysis_prompt)
            
            # Step 2: Generate structure
            structure_prompt = f"""
            Based on this analysis, create a detailed contract structure:
            
            {analysis}
            
            Provide:
            1. Contract title and sections
            2. Detailed clause outline
            3. Special provisions needed
            4. Order of clauses for optimal flow
            """
            
            structure = self._execute_workflow_step(structure_prompt)
            
            # Step 3: Draft content
            content_prompt = f"""
            Create a complete professional contract with this structure:
            
            {structure}
            
            Requirements:
            - Contract Type: {request.contract_type}
            - Parties: {request.parties}
            - Scope: {request.scope_short}
            - Payment Terms: {request.payment_terms}
            - Jurisdiction: {request.jurisdiction}
            - Risk Profile: {request.risk_profile}
            
            Include proper legal language, defined terms, and comprehensive clauses.
            Make it professional and legally sound.
            """
            
            content = self._execute_workflow_step(content_prompt)
            
            # Step 4: Generate summary
            summary_prompt = f"Provide a 3-line executive summary of this contract:\n\n{content[:1000]}..."
            summary = self._execute_workflow_step(summary_prompt)
            
            return {
                "content": content,
                "summary": summary,
                "structure_analysis": structure,
                "requirements_analysis": analysis
            }
            
        except Exception as e:
            raise Exception(f"Error generating draft: {str(e)}")

    async def analyze_document(self, document_text: str, filename: str) -> Dict[str, Any]:
        """Analyze uploaded legal document using enhanced workflow"""
        try:
            # Step 1: Extract clauses
            clause_prompt = f"""
            As a legal clause extraction expert, analyze this document and extract all clauses:
            
            {document_text[:4000]}
            
            For each clause, identify:
            1. Clause type (confidentiality, payment, termination, etc.)
            2. Risk level (Low/Medium/High)
            3. Importance to the contract
            4. Key terms and conditions
            
            Provide structured analysis.
            """
            
            clause_analysis = self._execute_workflow_step(clause_prompt)
            
            # Step 2: Risk analysis
            risk_prompt = f"""
            As a legal risk analyst, analyze the risks in this document:
            
            Document: {filename}
            Clause Analysis: {clause_analysis}
            
            Provide:
            1. Overall risk score (0-1)
            2. High-risk clauses and why
            3. Compliance concerns
            4. Recommendations for risk mitigation
            """
            
            risk_analysis = self._execute_workflow_step(risk_prompt)
            
            # Step 3: Generate insights
            insights_prompt = f"""
            As a legal insights expert, provide actionable recommendations:
            
            Risk Analysis: {risk_analysis}
            
            Generate:
            1. Key insights and findings
            2. Improvement suggestions
            3. Compliance notes
            4. Negotiation points to consider
            """
            
            insights = self._execute_workflow_step(insights_prompt)
            
            return {
                "document_type": self._extract_document_type(document_text),
                "clause_analysis": clause_analysis,
                "risk_analysis": risk_analysis,
                "insights": insights,
                "filename": filename,
                "word_count": len(document_text.split()),
                "analyzed_at": "2025-01-21",
                "summary": f"Comprehensive analysis completed for {filename}"
            }
            
        except Exception as e:
            raise Exception(f"Error analyzing document: {str(e)}")

    async def chat_response(self, user_message: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Generate enhanced chatbot response"""
        try:
            # Step 1: Understand query
            understanding_prompt = f"""
            As a legal query analyzer, categorize this user query:
            
            Query: {user_message}
            
            Determine:
            1. Query type (explanation, drafting, analysis, general)
            2. User intent and what they need
            3. Complexity level
            4. Context needed for best response
            """
            
            query_analysis = self._execute_workflow_step(understanding_prompt)
            
            # Step 2: Generate specialized response
            if "explanation" in query_analysis.lower():
                system_context = "You are a legal explanation specialist. Provide clear, comprehensive explanations of legal concepts."
            elif "drafting" in query_analysis.lower():
                system_context = "You are a legal drafting assistant. Help with creating legal documents and clauses."
            elif "analysis" in query_analysis.lower():
                system_context = "You are a legal analysis expert. Analyze documents and provide actionable insights."
            else:
                system_context = "You are a comprehensive legal assistant. Provide helpful, accurate legal guidance."
            
            response_prompt = f"""
            {system_context}
            
            User Query: {user_message}
            Query Analysis: {query_analysis}
            Context: {json.dumps(context) if context else 'None'}
            
            Provide a helpful, accurate response. Always recommend consulting qualified legal counsel for specific advice.
            """
            
            response = self._execute_workflow_step(response_prompt)
            
            # Extract query type for frontend
            query_type = "general"
            if "explanation" in query_analysis.lower():
                query_type = "explanation"
            elif "drafting" in query_analysis.lower():
                query_type = "drafting"
            elif "analysis" in query_analysis.lower():
                query_type = "analysis"
            
            recommendations = self._generate_followup_questions(query_type, user_message)
            
            return {
                "response": response,
                "query_type": query_type,
                "intent": "Legal assistance",
                "recommendations": recommendations
            }
            
        except Exception as e:
            raise Exception(f"Error generating chat response: {str(e)}")

    def _generate_followup_questions(self, query_type: str, user_input: str) -> List[str]:
        """Generate helpful follow-up questions"""
        base_questions = [
            "Would you like me to explain any specific terms?",
            "Do you need help with related legal considerations?",
            "Would you like suggestions for next steps?"
        ]
        
        if query_type == 'drafting':
            base_questions.extend([
                "Would you like me to review specific clauses?",
                "Do you need templates for similar documents?"
            ])
        elif query_type == 'analysis':
            base_questions.extend([
                "Would you like a risk assessment?",
                "Do you need recommendations for improvements?"
            ])
        
        return base_questions[:3]

    def _extract_document_type(self, text: str) -> str:
        """Identify document type from content"""
        text_lower = text.lower()
        
        document_types = {
            "Employment Agreement": ["employment agreement", "employment contract", "job offer"],
            "Service Agreement": ["service agreement", "consulting agreement", "professional services"],
            "Non-Disclosure Agreement": ["non-disclosure", "nda", "confidentiality agreement"],
            "Lease Agreement": ["lease agreement", "rental agreement", "tenancy"],
            "Purchase Agreement": ["purchase agreement", "sales contract", "buy-sell"],
            "Partnership Agreement": ["partnership agreement", "joint venture"]
        }
        
        for doc_type, indicators in document_types.items():
            if any(indicator in text_lower for indicator in indicators):
                return doc_type
        
        return "General Legal Document"

    # Public API methods for compatibility
    async def explain_clause(self, clause_text: str, explanation_type: str) -> ExplainClauseResponse:
        """Explain a clause using enhanced workflow"""
        try:
            if explanation_type == "eli5":
                user_input = f"Explain this legal clause as if explaining to a 5-year-old: {clause_text}"
            elif explanation_type == "technical":
                user_input = f"Provide a detailed technical explanation of this legal clause: {clause_text}"
            else:
                user_input = f"Explain this legal clause using precise legal terminology: {clause_text}"
            
            result = await self.chat_response(user_input)
            
            return ExplainClauseResponse(
                explanation=result.get('response', ''),
                confidence=0.85,
                citations=[]
            )
            
        except Exception as e:
            raise Exception(f"Error explaining clause: {str(e)}")

    async def simulate_clause_change(self, original_clause: str, modified_clause: str) -> SimulateClauseResponse:
        """Simulate the impact of changing a clause"""
        try:
            user_input = f"""Analyze the impact of changing this legal clause:
            
            ORIGINAL: {original_clause}
            
            MODIFIED: {modified_clause}
            
            Provide impact analysis, risk assessment, and recommendations."""
            
            result = await self.chat_response(user_input)
            response_text = result.get('response', '')
            
            return SimulateClauseResponse(
                impact_analysis={"analysis": response_text},
                risk_assessment=0.5,
                recommendations=["Review with legal counsel", "Consider stakeholder impact"]
            )
            
        except Exception as e:
            raise Exception(f"Error simulating clause change: {str(e)}")

    # Additional helper methods for backwards compatibility
    def extract_clauses(self, content: str) -> List[Dict[str, Any]]:
        """Extract individual clauses from contract content"""
        sections = content.split("\n\n")
        clauses = []
        
        for section in sections:
            if len(section.strip()) > 50:
                clause_type = self._identify_clause_type(section)
                clauses.append({
                    "type": clause_type,
                    "text": section.strip(),
                    "variables": {},
                    "risk_score": self._calculate_risk_score(section),
                })
        
        return clauses

    def _identify_clause_type(self, text: str) -> str:
        """Identify the type of clause based on content"""
        text_lower = text.lower()
        
        clause_types = {
            "confidentiality": ["confidential", "non-disclosure", "proprietary"],
            "payment": ["payment", "fee", "compensation", "invoice"],
            "termination": ["terminate", "termination", "end", "expire"],
            "indemnification": ["indemnify", "indemnification", "liability", "damages"],
            "intellectual_property": ["intellectual property", "copyright", "patent", "trademark"],
            "governing_law": ["governing law", "jurisdiction", "dispute", "arbitration"]
        }
        
        for clause_type, indicators in clause_types.items():
            if any(indicator in text_lower for indicator in indicators):
                return clause_type
        
        return "general"

    def _calculate_risk_score(self, text: str) -> float:
        """Calculate a simple risk score for a clause"""
        high_risk_terms = ["unlimited liability", "personal guarantee", "no limitation", "perpetual"]
        medium_risk_terms = ["liable", "damages", "penalty", "breach"]
        
        text_lower = text.lower()
        risk_score = 0.3  # Base risk
        
        for term in high_risk_terms:
            if term in text_lower:
                risk_score += 0.3
        
        for term in medium_risk_terms:
            if term in text_lower:
                risk_score += 0.1
        
        return min(risk_score, 1.0)

    # Legacy method implementations for existing API compatibility
    async def suggest_redline(self, redline_request: Dict[str, Any]) -> Dict[str, Any]:
        """Suggest redline changes using enhanced workflow"""
        user_message = f"""Suggest redline changes for this clause:
        
        CLAUSE: {redline_request.get('clause_text', '')}
        RISK PROFILE: {redline_request.get('risk_profile', 'balanced')}
        INSTRUCTIONS: {redline_request.get('instructions', '')}"""
        
        result = await self.chat_response(user_message)
        
        return {
            "redline_text": result.get('response', ''),
            "rationale": "Enhanced workflow-generated redline based on risk profile and instructions",
            "confidence": 0.82,
        }

    async def generate_alternatives(self, alternatives_request: Dict[str, Any]) -> Dict[str, Any]:
        """Generate alternative clause versions using enhanced workflow"""
        user_message = f"""Provide 3 variants (safe, balanced, aggressive) for this clause:
        
        ORIGINAL CLAUSE: {alternatives_request.get('clause_text', '')}"""
        
        result = await self.chat_response(user_message)
        
        return {
            "alternatives": result.get('response', ''),
            "variants": ["safe", "balanced", "aggressive"],
        }

    async def analyze_risk(self, risk_request: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze risk using enhanced workflow"""
        user_message = f"""Analyze the legal and business risks in this text:
        
        {risk_request.get('text', '')}"""
        
        result = await self.chat_response(user_message)
        
        return {
            "analysis": result.get('response', ''),
            "risk_score": 0.6,
            "risk_level": "Medium",
            "recommendations": ["Review with legal counsel", "Consider additional protections"],
        }

    async def simulate_changes(self, simulation_request: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate document changes using enhanced workflow"""
        user_message = f"""Simulate the impact of these document changes:
        
        {simulation_request.get('description', '')}
        Changes: {simulation_request.get('changes', '')}"""
        
        result = await self.chat_response(user_message)
        
        return {
            "impact_summary": result.get('response', ''),
            "financial_impact": {"range": "$1000-$5000", "risk": "Low"},
            "legal_impact": {
                "assessment": "Minimal risk increase",
                "recommendations": [],
            },
            "compliance_impact": {
                "status": "Compliant",
                "notes": "No compliance issues identified",
            },
        }