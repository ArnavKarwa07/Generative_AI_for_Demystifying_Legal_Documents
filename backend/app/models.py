from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    ForeignKey,
    JSON,
    Float,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    documents = relationship("Document", back_populates="owner")
    workflows = relationship("Workflow", back_populates="created_by")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    parties = Column(JSON)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    jurisdiction = Column(String)
    status = Column(String, default="draft")
    version_id = Column(String)
    storage_path = Column(String)
    retention_policy = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="documents")
    versions = relationship("Version", back_populates="document")
    clauses = relationship("Clause", back_populates="document")
    workflows = relationship("Workflow", back_populates="document")
    obligations = relationship("Obligation", back_populates="document")


class Version(Base):
    __tablename__ = "versions"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    created_by_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    diff_summary = Column(Text)
    signed_flag = Column(Boolean, default=False)

    document = relationship("Document", back_populates="versions")
    created_by = relationship("User")


class Clause(Base):
    __tablename__ = "clauses"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    version_id = Column(Integer, ForeignKey("versions.id"), nullable=True)
    clause_type = Column(String)
    text = Column(Text, nullable=False)
    embeddings = Column(JSON)
    citations = Column(JSON)
    variables = Column(JSON)
    risk_score = Column(Float)
    tags = Column(JSON)
    last_updated = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("Document", back_populates="clauses")
    version = relationship("Version")


class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contract_type = Column(String)
    variables = Column(JSON)
    clauses = Column(JSON)  # Ordered list of clause IDs
    tags = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Playbook(Base):
    __tablename__ = "playbooks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    rules = Column(JSON)  # Mandatory/forbidden rules
    preferred_clauses = Column(JSON)
    negotiation_strategy = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    steps = Column(JSON)  # Approver roles and sequence
    triggers = Column(JSON)
    status = Column(String, default="pending")
    created_by_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("Document", back_populates="workflows")
    created_by = relationship("User", back_populates="workflows")


class Obligation(Base):
    __tablename__ = "obligations"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    clause_id = Column(Integer, ForeignKey("clauses.id"))
    description = Column(Text, nullable=False)
    due_date = Column(DateTime)
    owner_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="pending")

    document = relationship("Document", back_populates="obligations")
    clause = relationship("Clause")
    owner = relationship("User")


class FileStorage(Base):
    __tablename__ = "file_storage"

    id = Column(String, primary_key=True, index=True)  # UUID
    filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    file_data = Column(Text, nullable=False)  # Base64 encoded file data
    file_size = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_by = relationship("User")
