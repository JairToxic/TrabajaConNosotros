import pdfplumber

# Función para extraer el texto desde un archivo PDF
def extract_text_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()  # Extrae el texto de cada página
        return text

# Ruta al archivo PDF del CV
pdf_path = "./CV_Jair.pdf"  # Cambia esta ruta por la ubicación de tu archivo PDF en la carpeta 'data'
cv_text = extract_text_from_pdf(pdf_path)

# Mostrar los primeros 1000 caracteres del texto extraído
print(cv_text[:10000])  # Puedes ajustar la cantidad según lo que necesites
