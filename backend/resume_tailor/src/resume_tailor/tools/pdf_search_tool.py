# tools/pdf_search_tool.py
# Uses PyPDF2 directly instead of crewai-tools PDFSearchTool
# (crewai-tools requires lancedb<0.6.0 which no longer exists on PyPI)
from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
import os
import tempfile
import requests
import PyPDF2
import io


class DynamicPDFInput(BaseModel):
    pdf_path: str = Field(..., description="Local path or HTTP URL to the PDF file.")
    query: str = Field(
        None, description="Optional question to search for within the PDF."
    )


class DynamicPDFTool(BaseTool):
    name: str = "Dynamic PDF Tool"
    description: str = (
        "Downloads (if needed) and extracts text from a given PDF file dynamically."
    )
    args_schema: Type[BaseModel] = DynamicPDFInput

    def _run(self, pdf_path: str, query: str = None) -> str:
        try:
            # If URL -> download to bytes
            if pdf_path.startswith("http://") or pdf_path.startswith("https://"):
                response = requests.get(pdf_path, timeout=30)
                response.raise_for_status()
                pdf_bytes = io.BytesIO(response.content)
            else:
                if not os.path.exists(pdf_path):
                    return "❌ Error: PDF could not be accessed."
                with open(pdf_path, "rb") as f:
                    pdf_bytes = io.BytesIO(f.read())

            # Extract all text with PyPDF2
            reader = PyPDF2.PdfReader(pdf_bytes)
            text_parts = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    text_parts.append(text)

            full_text = "\n".join(text_parts)

            if not full_text.strip():
                return "⚠️ PDF loaded but no extractable text found."

            if not query:
                return f"✅ PDF loaded successfully.\n\n{full_text}"

            # Simple keyword search through extracted text
            query_lower = query.lower()
            matching_lines = [
                line for line in full_text.split("\n")
                if query_lower in line.lower()
            ]

            if matching_lines:
                return f"📄 Query Result for '{query}':\n" + "\n".join(matching_lines[:20])
            else:
                # Return full text if no keyword match — let the LLM figure it out
                return f"📄 Full resume text (query '{query}' not found as keyword):\n{full_text}"

        except Exception as e:
            return f"❌ Error while processing PDF: {e}"
