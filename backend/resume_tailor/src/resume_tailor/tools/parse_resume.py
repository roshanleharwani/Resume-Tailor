# tools/latex_to_pdf_tool.py
from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
import subprocess
import tempfile
import os
import re


class LatexToPDFInput(BaseModel):
    """Input schema for LatexToPDFTool."""

    latex_content: str = Field(
        ..., description="The raw LaTeX code to compile into PDF"
    )


class LatexToPDFTool(BaseTool):
    name: str = "Latex to PDF Tool"
    description: str = (
        "Compiles raw LaTeX code into a PDF. Automatically removes code fences "
        "(```latex ... ```), cleans the LaTeX content, and returns the path to the compiled PDF file."
    )
    args_schema: Type[BaseModel] = LatexToPDFInput

    def _run(self, latex_content: str) -> str:
        """Cleans LaTeX content and compiles into PDF, returning the output file path."""

        # -------------------------------------------------------------
        # CLEAN CODE BLOCK FENCES IF LLM OUTPUTS ```latex ... ```
        # -------------------------------------------------------------
        latex_content = latex_content.strip()

        # Remove starting ```latex or ```tex or ```
        latex_content = re.sub(r"^```(?:latex|tex)?\s*", "", latex_content)

        # Remove trailing ```
        latex_content = re.sub(r"\s*```$", "", latex_content)

        # -------------------------------------------------------------
        # TEMP DIRECTORY FOR COMPILATION
        # -------------------------------------------------------------
        with tempfile.TemporaryDirectory() as tmpdir:
            tex_path = os.path.join(tmpdir, "resume.tex")
            pdf_path = os.path.join(tmpdir, "resume.pdf")

            # Write cleaned LaTeX to .tex file
            with open(tex_path, "w", encoding="utf-8") as f:
                f.write(latex_content)

            # -------------------------------------------------------------
            # RUN PDFLATEX
            # -------------------------------------------------------------
            try:
                subprocess.run(
                    ["pdflatex", "-interaction=nonstopmode", tex_path],
                    cwd=tmpdir,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    check=True,
                )
            except subprocess.CalledProcessError:
                return "Error: Failed to compile LaTeX. Invalid LaTeX content."

            # -------------------------------------------------------------
            # RETURN OUTPUT PATH
            # -------------------------------------------------------------
            if os.path.exists(pdf_path):
                # Save final PDF to project root
                final_output = os.path.abspath("tailored_resume.pdf")
                os.replace(pdf_path, final_output)
                return final_output
            else:
                return "Error: PDF generation failed. File not found."
