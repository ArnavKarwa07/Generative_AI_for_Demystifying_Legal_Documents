import os
import aiofiles
from typing import Dict, Any, Optional
import PyPDF2
import docx
import io


class DocumentProcessor:
    """Service to extract text from various document types"""

    @staticmethod
    async def extract_text(file_content: bytes, filename: str) -> str:
        """Extract text from document based on file type"""
        file_extension = filename.split(".")[-1].lower()

        if file_extension == "pdf":
            return DocumentProcessor._extract_from_pdf(file_content)
        elif file_extension in ["docx", "doc"]:
            return DocumentProcessor._extract_from_docx(file_content)
        elif file_extension == "txt":
            return DocumentProcessor._extract_from_txt(file_content)
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")

    @staticmethod
    def _extract_from_pdf(file_content: bytes) -> str:
        """Extract text from PDF file"""
        try:
            pdf_file = io.BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)

            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"

            return text.strip()
        except Exception as e:
            raise ValueError(f"Error extracting text from PDF: {str(e)}")

    @staticmethod
    def _extract_from_docx(file_content: bytes) -> str:
        """Extract text from DOCX file"""
        try:
            docx_file = io.BytesIO(file_content)
            doc = docx.Document(docx_file)

            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"

            return text.strip()
        except Exception as e:
            raise ValueError(f"Error extracting text from DOCX: {str(e)}")

    @staticmethod
    def _extract_from_txt(file_content: bytes) -> str:
        """Extract text from TXT file"""
        try:
            return file_content.decode("utf-8").strip()
        except UnicodeDecodeError:
            try:
                return file_content.decode("latin-1").strip()
            except Exception as e:
                raise ValueError(f"Error decoding text file: {str(e)}")

    @staticmethod
    def get_document_info(file_content: bytes, filename: str) -> Dict[str, Any]:
        """Get basic document information"""
        file_extension = filename.split(".")[-1].lower()
        file_size = len(file_content)

        info = {
            "filename": filename,
            "file_type": file_extension,
            "file_size": file_size,
            "file_size_mb": round(file_size / (1024 * 1024), 2),
        }

        # Get page count for PDFs
        if file_extension == "pdf":
            try:
                pdf_file = io.BytesIO(file_content)
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                info["page_count"] = len(pdf_reader.pages)
            except:
                info["page_count"] = None

        return info


# Global processor instance
document_processor = DocumentProcessor()
