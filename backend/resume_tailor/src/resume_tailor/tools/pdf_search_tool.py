# tools/dynamic_pdf_tool.py
from crewai.tools import BaseTool
from crewai_tools import PDFSearchTool
from typing import Type
from pydantic import BaseModel, Field
import os
import tempfile
import requests


class DynamicPDFInput(BaseModel):
    pdf_path: str = Field(..., description="Local path or HTTP URL to the PDF file.")
    query: str = Field(
        None, description="Optional question to search for within the PDF."
    )


class DynamicPDFTool(BaseTool):
    name: str = "Dynamic PDF Tool"
    description: str = (
        "Downloads (if needed) and searches a given PDF file dynamically."
    )
    args_schema: Type[BaseModel] = DynamicPDFInput

    def _run(self, pdf_path: str, query: str = None) -> str:
        try:
            local_pdf_path = pdf_path

            # ✅ If URL → download to temp file
            if pdf_path.startswith("http://") or pdf_path.startswith("https://"):
                response = requests.get(pdf_path, timeout=30)
                response.raise_for_status()

                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                    tmp.write(response.content)
                    local_pdf_path = tmp.name

            # ✅ Validate local file
            if not os.path.exists(local_pdf_path):
                return f"❌ Error: PDF could not be accessed."

            # Initialize PDFSearchTool with LOCAL file
            pdf_tool = PDFSearchTool(pdf=local_pdf_path)

            if not query:
                return "✅ PDF loaded successfully."

            result = pdf_tool.run(query)
            return f"📄 Query Result:\n{result}"

        except Exception as e:
            return f"❌ Error while processing PDF: {e}"
