# tools/latex_to_pdf_tool.py
from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
import subprocess
import os


class LatexToPDFInput(BaseModel):
    """Input schema for LatexToPDFTool."""

    latex_file: str = Field(..., description="The local path to the LaTeX .tex file")


class LatexToPDFTool(BaseTool):
    name: str = "LaTeX to PDF Tool"
    description: str = (
        "Converts a LaTeX (.tex) file to PDF using pdflatex and cleans up "
        "all auxiliary files, leaving only the PDF."
    )
    args_schema: Type[BaseModel] = LatexToPDFInput

    def _run(self, latex_file: str) -> str:
        work_dir = os.path.dirname(latex_file) or "."
        file_name = os.path.basename(latex_file)
        base_name = os.path.splitext(file_name)[0]

        command = ["pdflatex", "-interaction=nonstopmode", file_name]

        try:
            # Run pdflatex 2 times for proper references
            for _ in range(2):
                result = subprocess.run(
                    command, cwd=work_dir, capture_output=True, text=True
                )
                if result.returncode != 0:
                    return f"PDF compilation failed:\n{result.stdout}\n{result.stderr}"

            pdf_file = os.path.join(work_dir, base_name + ".pdf")
            if not os.path.exists(pdf_file):
                return "PDF compilation failed. No PDF was created."

            # Clean auxiliary files
            aux_extensions = [
                ".aux",
                ".log",
                ".out",
                ".toc",
                ".lof",
                ".lot",
                ".run.xml",
                ".xml",
                ".bcf",
            ]
            for ext in aux_extensions:
                aux_file = os.path.join(work_dir, base_name + ext)
                if os.path.exists(aux_file):
                    os.remove(aux_file)

            return f"PDF successfully created: {pdf_file}"

        except Exception as e:
            return f"An error occurred: {str(e)}"
