import subprocess
import os


def compile_latex(tex_path: str) -> str:
    """
    Compiles .tex into PDF using pdflatex.
    Returns PDF file path.
    """
    if not os.path.exists(tex_path):
        raise FileNotFoundError(tex_path)

    workdir = os.path.dirname(tex_path)
    tex_file = os.path.basename(tex_path)

    cmd = ["pdflatex", "-interaction=nonstopmode", tex_file]

    subprocess.run(
        cmd,
        cwd=workdir,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=True,
    )

    pdf_path = tex_path.replace(".tex", ".pdf")

    if not os.path.exists(pdf_path):
        raise RuntimeError("PDF not generated")

    return pdf_path
