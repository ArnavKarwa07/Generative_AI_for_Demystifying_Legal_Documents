# ClauseCraft™ - AI-Powered Legal Document Platform

**Generative AI Platform for Legal Document Analysis, Drafting, and Management**

## 🎯 Overview

ClauseCraft is a modern web-based platform that leverages artificial intelligence to transform how legal documents are analyzed, drafted, and managed. Built with React and FastAPI, it provides intelligent document processing, clause analysis, and AI-powered drafting assistance for legal professionals and businesses.

**Current Status**: Active Development - Core Features Implemented

**Target Users**: Legal teams, law firms, SMBs, contract managers, and compliance professionals

## 🚀 Problem Statement

Legal document analysis and contract management face several critical challenges:

- **Fragmented Workflows**: Legal teams use multiple disconnected tools for drafting, review, storage, and negotiation
- **Time-Intensive Analysis**: Manual document review and clause analysis consume significant resources
- **Lack of AI Transparency**: Existing AI tools often lack explainability and provenance for legal recommendations
- **Security Concerns**: Legal documents require enterprise-grade security and compliance controls
- **Knowledge Silos**: Legal expertise is often trapped in individual experience rather than being systematically accessible

ClauseCraft addresses these challenges by providing an integrated, AI-powered platform with explainable document analysis, secure collaboration, and intelligent drafting assistance.

## ✨ Core Features

### 📄 Document Management & Analysis

- **Smart Upload**: Support for PDF, DOCX, TXT with automatic OCR and text extraction
- **AI-Powered Analysis**: Intelligent document type detection, risk assessment, and clause identification
- **Metadata Extraction**: Automatic extraction of parties, dates, key terms, and obligations
- **Document Repository**: Secure storage with search, filtering, and organization capabilities

### 🤖 AI-Powered Legal Assistant

- **Clause Explanation**: Plain English explanations of complex legal language with multiple detail levels
- **Risk Assessment**: Automated risk scoring and identification of potential issues
- **Clause Simulation**: "What-if" analysis showing potential impacts of clause modifications
- **Document Summarization**: Intelligent summaries highlighting key terms and obligations

### ✍️ Intelligent Drafting

- **Draft Editor**: Rich text editor with AI-powered suggestions and clause recommendations
- **Template System**: Pre-built templates for common contract types (NDAs, Service Agreements, etc.)
- **Clause Library**: Searchable repository of standard clauses with risk ratings and alternatives
- **Version Control**: Track changes and maintain document history with diff visualization

### 🔐 Enterprise Security

- **Authentication**: JWT-based secure authentication with role-based access control
- **Data Protection**: Encrypted storage and transmission with privacy controls
- **Audit Trail**: Comprehensive logging of all user actions and AI decisions
- **Compliance Ready**: Built with GDPR and enterprise compliance requirements in mind

## 🏗️ Architecture

### Frontend Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API service layer
├── contexts/           # React contexts (Auth, etc.)
├── utils/             # Utility functions
└── main.jsx           # Application entry point
```

### Backend Structure

```
backend/
├── app/
│   ├── routers/       # API route handlers
│   ├── services/      # Business logic services
│   ├── models.py      # Database models
│   ├── schemas.py     # Pydantic schemas
│   └── config.py      # Configuration
├── requirements.txt   # Python dependencies
└── main.py           # FastAPI application
```

## 🛠️ Technology Stack

### Frontend

- **React 18** with Vite for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **React Router** for client-side routing
- **Context API** for state management
- **Material Symbols** for consistent iconography

### Backend

- **FastAPI** for high-performance API development
- **SQLAlchemy** for database ORM
- **PostgreSQL** for relational data storage
- **JWT** for secure authentication
- **Groq** integration for AI language models
- **LangGraph** for advanced AI workflows

### AI & ML

- **Groq Cloud API** for fast inference
- **LangGraph** for complex AI agent workflows
- **scikit-learn** for analytics and ML utilities
- **Document processing** for PDF, DOCX, and text extraction

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- PostgreSQL database
- Groq API key

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend `.env`:**

```
DATABASE_URL=postgresql://username:password@localhost/clausecraft
GROQ_API_KEY=your_groq_api_key
JWT_SECRET_KEY=your_jwt_secret
```

## 📱 Features Implemented

### Dashboard

- Overview of document statistics
- Recent document activity
- Quick access to key functions
- Responsive design for all devices

### Document Management

- Document upload with drag-and-drop
- File type support: PDF, DOCX, TXT
- Document analysis and metadata extraction
- Risk assessment and classification
- Search and filtering capabilities

### AI-Powered Analysis

- Automated document type detection
- Clause-level risk assessment
- Plain English explanations
- Document summarization

### Draft Editor

- Rich text editing interface
- AI-powered clause suggestions
- Template-based document creation
- Version control and history tracking

### Clause Library

- Searchable clause repository
- Risk ratings and alternatives
- Tag-based organization
- Export and import functionality

### Negotiation Workspace

- Collaborative editing features
- Comment and annotation system
- Track changes functionality
- Workflow management

## 🎯 API Endpoints

### Document Management

```http
POST /api/documents/upload
GET /api/documents/
GET /api/documents/{id}
PUT /api/documents/{id}
DELETE /api/documents/{id}
```

### AI Services

```http
POST /api/ai/explain-clause
POST /api/ai/analyze-document
POST /api/ai/simulate-changes
POST /api/ai/suggest-alternatives
```

### Draft Management

```http
POST /api/drafts/
GET /api/drafts/
GET /api/drafts/{id}
PUT /api/drafts/{id}
```

### Authentication

```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
GET /api/auth/me
```

## 🔧 Current Implementation Status

### ✅ Completed Features

- **Authentication System**: JWT-based login/logout with demo mode
- **Document Upload & Storage**: Multi-format support with metadata extraction
- **AI Document Analysis**: Groq integration for intelligent document processing
- **Clause Explanation**: Multi-level explanations (ELI5, Technical, Legal)
- **Draft Editor**: Rich text editing with AI suggestions
- **Clause Library**: Searchable repository with tagging
- **Responsive UI**: Mobile-first design with dark mode support
- **Document Management**: CRUD operations with filtering and search

### 🚧 In Development

- **Clause Simulation**: "What-if" analysis for clause modifications
- **Advanced AI Workflows**: LangGraph integration for complex reasoning
- **Workflow Management**: Approval processes and collaboration features
- **Enhanced Analytics**: Document insights and usage metrics

### 📋 Planned Features

- **E-signature Integration**: DocuSign and Adobe Sign support
- **Obligation Tracking**: Automated deadline and milestone monitoring
- **Enterprise SSO**: SAML and OAuth integration
- **Advanced Security**: Audit trails and compliance features
- **API Integrations**: Salesforce, SharePoint, and other enterprise tools

## 🚀 Development Roadmap

### Phase 1: Core Platform (Completed)

- ✅ Basic document management
- ✅ AI-powered analysis
- ✅ User authentication
- ✅ Responsive web interface

### Phase 2: Advanced AI Features (Current)

- 🔄 Clause simulation and impact analysis
- 🔄 Enhanced document insights
- 🔄 Improved AI explanations
- 🔄 Template generation

### Phase 3: Collaboration & Workflows (Next)

- 📋 Multi-user collaboration
- 📋 Approval workflows
- 📋 Real-time editing
- 📋 Comment and annotation system

### Phase 4: Enterprise Features (Future)

- 📋 SSO integration
- 📋 Advanced security controls
- 📋 Audit and compliance
- 📋 Enterprise integrations

## 🤝 Contributing

We welcome contributions to ClauseCraft! Please see our contributing guidelines for more information.

### Development Setup

1. Clone the repository
2. Set up the backend (Python/FastAPI)
3. Set up the frontend (React/Vite)
4. Configure environment variables
5. Run the development servers

### Code Style

- Frontend: ESLint + Prettier for JavaScript/React
- Backend: Black + isort for Python
- Commit messages: Conventional Commits format

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with open-source technologies
- AI capabilities powered by Groq
- UI components inspired by modern design systems
- Special thanks to the legal tech community for feedback and insights

---

**ClauseCraft** - Transforming legal document management with AI

Clause

id, document_id, version_id, clause_type, text, embeddings, citations, variables, risk_score

Template

id, name, contract_type, variables, clauses (ordered), tags

Playbook

id, name, rules (mandatory/forbidden), preferred_clauses, negotiation_strategy

User

id, name, role, permissions, org_id

Workflow

id, document_id, steps (approver roles), triggers

Obligation

id, document_id, clause_id, description, due_date, owner, status

8. API examples (selected)
   POST /api/v1/documents/upload

Request: multipart/form-data { file, metadata }
Response: { document_id, status }

POST /api/v1/draft

Request:

{
"type":"SOW",
"brief":"Develop a mobile app for XYZ. Contractor to deliver milestones, payment 30% advance, 70% on completion. Jurisdiction: India. Risk profile: balanced.",
"template_id": null,
"variables":{"partyA":"XYZ Ltd","partyB":"ACME Pvt Ltd","term":"12 months"}
}

Response:

{
"draft_id":"d_9876",
"document_id":"doc_1234",
"status":"generated",
"summary":"SOW skeleton with 12 clauses, obligations extracted..."
}

POST /api/v1/clauses/{clause_id}/redline

Request:

{"risk_profile":"safe","instructions":"Add mutual indemnity and insurance requirement"}

Response:

{"redline_text":"...","rationale":"Mitigates risk by requiring mutual indemnity and minimum insurance INR 10,00,000","confidence":0.82}

GET /api/v1/documents/{id}/obligations

Response: list of obligations with due_dates and owners.

POST /api/v1/documents/{id}/workflow/start

Request: workflow template id and initial approvers.
Response: workflow instance id, status.

9. Drafting & prompt templates (for generator)
   Generate first draft from brief

Prompt: Create a {contract_type} for {partyA} (client) and {partyB} (vendor). Scope: {scope_short}. Payment: {payment_terms}. Jurisdiction: {jurisdiction}. Risk appetite: {risk_profile}. Output: full contract with TOC, clauses, defined variables, and a 3-line executive summary. Include citations for legal constraints if present.

Rewrite clause for risk profile

Prompt: Rewrite the clause: {clause_text}. Target: {risk_profile}. Keep length <= 3 sentences. List 2 suggested negotiation concessions and required supporting documents (e.g., insurance certificate). Provide citations if statutory obligations apply.

Generate clause alternatives

Prompt: Provide 3 variants (safe, balanced, aggressive) for clause: {clause_text} — include redline diff against original and a 1-line rationale for each.

Create template from multiple examples

Prompt: Given these 10 NDAs (attached), produce a canonical NDA template for {jurisdiction} capturing common mandatory terms, optional clauses, and a default mutual or unilateral option. Annotate each clause with recommended risk level.

10. UI/UX — key screens & flows
    10.1 Home / Dashboard

Recent docs, alerts, pending approvals, playbook compliance score.

10.2 Document Explorer

Searchable list with filters (party, status, type).

Quick actions: open, start draft, start workflow.

10.3 Draft Editor (WYSIWYG)

Left: TOC + version history; Middle: editor with inline AI suggestions; Right: Clause pane (explain, alternatives, provenance).

Buttons: Suggest Alternative, Auto-Redline, Run Simulator, Add to Playbook.

10.4 Clause Library & Playbooks

Browse approved clauses, tag, import/export.

10.5 Negotiation Workspace

Redline view, comments, negotiation playbook, chat, suggested scripts.

10.6 Workflow Manager

Visual flowchart of approvals, step owners, SLAs.

10.7 Obligation Dashboard

Upcoming obligations, owner, status, calendar integration.

10.8 Admin Console

Settings for templates, playbooks, users, data retention, model tuning settings.

11. Training data strategy & human-in-loop
    11.1 Data sources

Public corpora: statutes, regulations, sample contracts.

Hand-curated templates and clause libraries.

Customer-provided contracts (with consent).

Synthetic data: paraphrases, counterfactuals for training simulator.

11.2 Labeling & feedback

Lawyer in-loop: approve suggestions, rate accuracy, flag hallucinations.

Active learning: corrected outputs chained to retraining pipelines.

Continuous evaluation sets per jurisdiction and clause type.

11.3 Model governance

Model cards for each deployed LLM (version, training data description, known limitations).

Canary rollouts and A/B testing for model updates.

Logging inputs/outputs for audit and improvement.

12. Evaluation & KPIs
    Accuracy & Safety

Explanation correctness (lawyer-validated) ≥ target (e.g., 90% for low-risk clauses).

Citation precision ≥ 85%.

Hallucination rate < threshold.

Business & Adoption

Time saved per document (mins).

Reduction in first-pass lawyer hours.

Templates / clauses reused per month.

Conversion: trial → paid, enterprise retention.

CLM Metrics

Time-to-sign average.

Number of redlines per negotiation.

Obligation compliance rate.

13. Implementation roadmap & milestones

Phase 0 — Discovery & Compliance (4 weeks)

Stakeholder interviews, dataset collection plan, architecture validation, legal disclaimers.

Phase 1 — MVP (8–10 weeks)

Core ingest, clause segmentation, ELI5 explanations + RAG, basic drafting assistant for 3 contract types, repository + versioning, basic redline editor.

Phase 2 — CLM & Draft Robustness (10–12 weeks)

Approval workflows, e-sign integration, obligation extraction, template & clause library, playbook enforcement.

Phase 3 — Simulator & Governance (8–10 weeks)

Counterfactual simulator, probabilistic risk scoring, knowledge graph, lawyer review workflows, model governance.

Phase 4 — Enterprise & Integrations (8–12 weeks)

VPC/on-prem support, SSO, connectors (Salesforce, SharePoint), analytics dashboard, compliance certification prep (SOC2).

Phase 5 — Advanced features (ongoing)

Multi-jurisdiction fine-tuning, market-place for vetted clause packs, lawyer on-demand, litigation outcome model.

14. Suggested tech stack & open-source components

Frontend: React + TypeScript, Tailwind CSS.

Backend: Node.js/Express or FastAPI (Python) microservices.

LLMs: Fine-tuned transformer models (open-source: Llama family derivatives, Mistral, or hosted models depending on enterprise constraints).

Embeddings: SentenceTransformers or similar.

Vector DB: Milvus / Weaviate / Pinecone.

OCR: Tesseract / Google Vision for higher accuracy.

Knowledge Graph: Neo4j or Dgraph.

DBs: PostgreSQL, Redis for caches.

Workflow engine: Temporal or Camunda.

Kubernetes for orchestration.

CI/CD: GitHub Actions, Docker, Helm.

Observability: Prometheus, Grafana, ELK stack.

15. Security, privacy & legal compliance (detail)

Data residency & retention settings per org.

Encryption: TLS for transit; AES-256 (or equivalent) for rest; KMS for keys.

Access control: RBAC + SSO/SAML/OAuth + MFA.

Privacy: default non-persistent mode; PII redaction; hashed-only embeddings optional.

Audit trail: immutable logs capturing inputs, model prompts, outputs, user actions.

Compliance: GDPR (data subject rights), SOC2 (procedures), HIPAA mode for health-related contracts.

Legal disclaimer: all outputs are “assistive” — require human legal review; platform must surface this at points of high-risk use.

16. Business model & monetization

Freemium: limited document size, basic explanations, community templates.

Pro (SMB): drafting credits, clause library, basic workflows, email support.

Enterprise: VPC/on-prem deployment, SSO, SLA, advanced CLM, custom fine-tuning, audit features.

Add-ons: pay-per-redline, legal-reviewed redline packs, lawyer-on-demand, litigation analytics.

Marketplace: vetted clause packs and template bundles (rev-share model).

17. Competitive differentiation (USPs recap, expanded)

Full CLM + Generative Drafting in one platform — explain, simulate, draft, store, negotiate, sign and track obligations end-to-end.

Clause-level provenance for generated drafts — each drafted clause links to sources, playbook rules, and editable provenance notes.

Risk-aware drafting — drafts include predicted negotiation friction and impact estimates.

Playbook & Knowledge Graph enforcement — ensures corporate policy compliance at drafting time.

Lawyer-in-loop governance & audit trail — every suggestion is auditable and reversible, enabling defensibility.

Deployment flexibility & privacy — SaaS, VPC or on-prem to meet regulatory needs.

18. Limitations, ethical considerations & mitigations

Not a substitute for legal advice — always include warnings and require lawyer sign-off for high-risk matters.

Model bias & data limitations — mitigate via curated datasets, lawyer feedback, and transparent model cards.

Hallucinations risk — enforce citation-first policy, symbolic checks for deterministics (dates, amounts), and mandatory human approval gates for high-risk changes.

Data security risk — follow strict access controls and provide on-prem option.

19. Testing, validation & rollout plan

Pilot with in-house legal teams for iterative feedback.

Human validation sets per clause type and jurisdiction.

Red-team for adversarial prompts and hallucination detection.

Measure KPIs (accuracy, adoption, time saved) and run A/B rollout of new features.

20. Demo scenarios & hackathon pitch flow (concise)

Upload a 2-page SOW → autoscan and show TOC + extracted obligations.

One-click “Generate First Draft” from a 3-line brief → show scaffold + populated variables.

Click a liability clause → show ELI5 + provenance + simulator; slide risk slider to change cap and show impact.

Suggest “Balanced Redline” → show suggested redline + negotiation script; send to approval workflow → e-sign.

Show obligation dashboard with renewal and obligation reminders.

21. Roadmap risks & mitigation (concise)

Data availability for jurisdictions → mitigate with synthetic data + local legal partners.

Integration friction → build well-documented APIs and off-the-shelf connectors.

Enterprise trust → provide VPC and on-prem deployment; SOC2 and penetration testing.

Model hallucination → multi-tier safeguards: RAG, symbolic checks, human approvals.

22. Appendix A — Sample generated SOW (short demo output)

Input brief:
“Mobile app development for XYZ Ltd. Contractor: ACME Pvt Ltd. Deliverables: discovery, UI design, MVP, testing. Payment: 30% advance, 40% milestone, 30% delivery. Term: 12 months. Jurisdiction: India. Risk profile: balanced.”

Generated TOC & sample clause (Delivery & Payment):

Delivery & Milestones

Discovery — 3 weeks — deliverable: discovery report.

UI Designs — 6 weeks — deliverable: high-fidelity mockups.

MVP Delivery — 20 weeks — deliverable: v1.0.

Testing & Handover — 4 weeks — deliverable: test report & source code.

Payment

“Client shall pay Contractor 30% of the total fee as advance within 7 days of signing. 40% shall be paid upon acceptance of the MVP milestone, and the remaining 30% upon final delivery and acceptance. All payments are subject to receipt of valid invoices. Late payments shall accrue interest at 1.5% per month.”

Liability (sample balanced clause)

“Each party's aggregate liability for all claims arising out of or in connection with this Agreement shall not exceed the total fees paid under this Agreement in the 12 months preceding the claim, except for liability arising from gross negligence or willful misconduct, which shall be unlimited.”

23. Appendix B — Sample prompt templates (detailed)

Full Draft from Brief
SYSTEM: You are a legal drafting assistant. USER: Generate a {contract_type} for {partyA} and {partyB}. Business summary: {one-liner}. Payment: {terms}. Jurisdiction: {jurisdiction}. Risk: {safe|balanced|aggressive}. Output sections: Executive summary, TOC, Definitions, Main clauses, Signatures, Annexes. Annotate each clause with [risk_level, mandatory_flag, citations if available].

Clause Alternatives
USER: For this clause: {clause_text}, produce 3 variants: (1) safe — reduces risk to drafter, (2) balanced — fair compromise, (3) aggressive — favours drafter. Provide redline diff and 1-line negotiation script for each.

Template Generation
USER: Build a template for {contract_type} suitable for {jurisdiction}. Include placeholders and a recommended playbook with mandatory vs optional clauses.

24. Appendix C — Suggested evaluation checklist for legal sign-off

Are parties and roles correctly identified?

Are monetary amounts and currencies correctly parsed?

Are dates and notice periods extracted and cross-checked?

Are mandatory corporate clauses present per playbook?

Are jurisdiction-specific statutory requirements referenced where applicable?

Is the draft free from hallucinated legal assertions?
