import os
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
import aiofiles
import shutil


class FileStorage:
    def __init__(self):
        self.documents_dir = "documents"
        self.uploads_dir = "uploads"
        self.drafts_dir = "drafts"
        self.metadata_file = os.path.join(self.documents_dir, "metadata.json")

        # Create directories
        os.makedirs(self.documents_dir, exist_ok=True)
        os.makedirs(self.uploads_dir, exist_ok=True)
        os.makedirs(self.drafts_dir, exist_ok=True)

        # Initialize metadata file if it doesn't exist
        if not os.path.exists(self.metadata_file):
            self._save_metadata({})

    def _load_metadata(self) -> Dict[str, Any]:
        """Load metadata from JSON file"""
        try:
            with open(self.metadata_file, "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}

    def _save_metadata(self, metadata: Dict[str, Any]):
        """Save metadata to JSON file"""
        with open(self.metadata_file, "w") as f:
            json.dump(metadata, f, indent=2, default=str)

    async def save_document(
        self,
        file_content: bytes,
        filename: str,
        file_type: Optional[str] = None,
        analysis: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Save uploaded document and return document ID"""
        doc_id = str(uuid.uuid4())

        # Create document directory
        doc_dir = os.path.join(self.documents_dir, doc_id)
        os.makedirs(doc_dir, exist_ok=True)

        # Save the file
        file_path = os.path.join(doc_dir, filename)
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(file_content)

        # Save metadata
        metadata = self._load_metadata()
        metadata[doc_id] = {
            "id": doc_id,
            "filename": filename,
            "file_type": file_type or filename.split(".")[-1].lower(),
            "uploaded_at": datetime.now().isoformat(),
            "file_path": file_path,
            "analysis": analysis or {},
        }
        self._save_metadata(metadata)

        return doc_id

    def get_document(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Get document metadata by ID"""
        metadata = self._load_metadata()
        return metadata.get(doc_id)

    def get_all_documents(self) -> List[Dict[str, Any]]:
        """Get all documents metadata"""
        metadata = self._load_metadata()
        return list(metadata.values())

    def delete_document(self, doc_id: str) -> bool:
        """Delete document and its metadata"""
        metadata = self._load_metadata()
        if doc_id not in metadata:
            return False

        # Remove directory
        doc_dir = os.path.join(self.documents_dir, doc_id)
        if os.path.exists(doc_dir):
            shutil.rmtree(doc_dir)

        # Remove from metadata
        del metadata[doc_id]
        self._save_metadata(metadata)

        return True

    async def update_document_analysis(self, doc_id: str, analysis: Dict[str, Any]):
        """Update document analysis"""
        metadata = self._load_metadata()
        if doc_id in metadata:
            metadata[doc_id]["analysis"] = analysis
            metadata[doc_id]["analyzed_at"] = datetime.now().isoformat()
            self._save_metadata(metadata)

    async def save_draft(self, content: str, title: Optional[str] = None) -> str:
        """Save draft document"""
        draft_id = str(uuid.uuid4())
        draft_path = os.path.join(self.drafts_dir, f"{draft_id}.md")

        async with aiofiles.open(draft_path, "w") as f:
            await f.write(content)

        # Save draft metadata
        metadata = self._load_metadata()
        if "drafts" not in metadata:
            metadata["drafts"] = {}

        metadata["drafts"][draft_id] = {
            "id": draft_id,
            "title": title or f"Draft {draft_id[:8]}",
            "created_at": datetime.now().isoformat(),
            "file_path": draft_path,
        }
        self._save_metadata(metadata)

        return draft_id

    def get_draft(self, draft_id: str) -> Optional[str]:
        """Get draft content"""
        metadata = self._load_metadata()
        drafts = metadata.get("drafts", {})

        if draft_id not in drafts:
            return None

        draft_path = drafts[draft_id]["file_path"]
        try:
            with open(draft_path, "r") as f:
                return f.read()
        except FileNotFoundError:
            return None

    def get_all_drafts(self) -> List[Dict[str, Any]]:
        """Get all drafts metadata"""
        metadata = self._load_metadata()
        return list(metadata.get("drafts", {}).values())


# Global storage instance
file_storage = FileStorage()
