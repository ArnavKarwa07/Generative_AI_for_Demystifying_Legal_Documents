# ClauseCraft - AI-Powered Legal Document Platform

A comprehensive platform combining generative AI, clause-level provenance, legal knowledge graph, drafting assistant, Contract Lifecycle Management (CLM) features, collaboration, e-sign, and secure enterprise deployment.

## 🚀 Features

### Core Capabilities

- **Document Ingest & Storage**: PDF/DOCX/TXT upload with OCR and structure extraction
- **Drafting Assistant**: AI-powered contract generation from business requirements
- **Explain & Simulate**: Clause-level explanations and impact simulation
- **Negotiation & Collaboration**: Real-time collaboration with redline tracking
- **Contract Lifecycle Management**: Approval workflows, e-signature, obligation tracking
- **Clause Library**: Reusable clauses with metadata and risk profiles
- **AI-Powered Analysis**: Risk assessment, alternative suggestions, compliance checking

### Technology Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: FastAPI + Python
- **AI**: Groq for agentic AI, scikit-learn for analytics
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT-based auth with bcrypt

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 13+
- Groq API Key

## 🛠️ Installation

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   DATABASE_URL=postgresql://user:password@localhost/clausecraft
   SECRET_KEY=your-super-secret-key-here
   GROQ_API_KEY=your-groq-api-key-here
   ```

5. **Database setup**

   ```bash
   # Create database
   createdb clausecraft

   # Run migrations (tables will be created automatically on first run)
   python main.py
   ```

6. **Start backend server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 🎯 Usage

### Getting Started

1. **Access the application** at http://localhost:3000
2. **Register an account** or login if you already have one
3. **Explore the dashboard** to see recent documents and pending approvals

### Key Workflows

#### Document Creation

1. Navigate to Documents → New Document
2. Upload existing document or start from template
3. Use AI drafting assistant for automatic generation
4. Review and edit in the Draft Editor

#### Clause Management

1. Go to Clauses Library
2. Browse existing clauses or create new ones
3. Use filters to find specific clause types
4. View clause explanations and alternatives

#### Contract Negotiation

1. Open document in Negotiation Workspace
2. Review redlines and changes
3. Use suggested scripts for responses
4. Collaborate via integrated chat

#### AI-Powered Features

- **Explain**: Get plain English explanations of complex clauses
- **Simulate**: See impact of clause modifications
- **Risk Analysis**: Automated risk scoring and recommendations
- **Alternative Suggestions**: AI-generated clause alternatives

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

### Key Services

- **AIService**: Groq integration for generative AI
- **DocumentAnalyzer**: scikit-learn for document analysis
- **Authentication**: JWT-based auth system
- **File Management**: Document upload and storage

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- File upload security
- Database query protection

## 🧪 API Documentation

The API is fully documented with OpenAPI/Swagger. Access the interactive documentation at:
http://localhost:8000/docs

### Key Endpoints

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Documents

- `GET /api/documents` - List documents
- `POST /api/documents` - Create document
- `POST /api/documents/upload` - Upload document file

#### AI Services

- `POST /api/ai/explain` - Explain clause
- `POST /api/ai/simulate` - Simulate changes
- `POST /api/ai/redline` - Suggest redlines

## 🔧 Configuration

### Environment Variables

| Variable       | Description                  | Default                  |
| -------------- | ---------------------------- | ------------------------ |
| `DATABASE_URL` | PostgreSQL connection string | -                        |
| `SECRET_KEY`   | JWT signing key              | -                        |
| `GROQ_API_KEY` | Groq API key for AI features | -                        |
| `REDIS_URL`    | Redis connection (optional)  | `redis://localhost:6379` |
| `UPLOAD_DIR`   | File upload directory        | `uploads`                |

### Groq Setup

1. Sign up at https://console.groq.com/
2. Create an API key
3. Add the key to your `.env` file as `GROQ_API_KEY`

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set all required environment variables
2. **Database**: Use managed PostgreSQL service
3. **File Storage**: Consider cloud storage for uploads
4. **Security**: Enable HTTPS, set strong secrets
5. **Monitoring**: Add logging and monitoring

### Docker Deployment (Optional)

```dockerfile
# Backend Dockerfile example
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Check the API documentation at `/docs`
- Review the troubleshooting section below

### Troubleshooting

#### Common Issues

1. **Database Connection Error**

   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Ensure database exists

2. **Groq API Errors**

   - Verify API key is correct
   - Check API quota and limits
   - Ensure network connectivity

3. **Frontend Build Issues**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall
   - Check Node.js version compatibility

## 🎉 Acknowledgments

- Built with FastAPI and React
- AI powered by Groq
- UI components inspired by modern design systems
- Legal domain expertise incorporated throughout
