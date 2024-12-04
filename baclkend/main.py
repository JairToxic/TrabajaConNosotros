import os
import pdfplumber

# Función para extraer el texto del PDF
def extract_text_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()  # Extraer texto de cada página
    return text

# Función principal
def main():
    # Ruta del archivo PDF (ajusta la ruta a tu archivo)
    pdf_path = './CV_Jair.pdf'  # Cambia esta ruta por la de tu archivo PDF

    # Extraer texto del CV
    cv_text = extract_text_from_pdf(pdf_path)

    # Imprimir el texto extraído para asegurarse de que se está extrayendo correctamente
    print("Texto extraído del CV:")
    print(cv_text)

    # Guardar el texto extraído en un archivo de texto para verificar
    with open("output/extracted_text.txt", "w") as outfile:
        outfile.write(cv_text)

    print("Texto extraído y guardado en output/extracted_text.txt")

if __name__ == "__main__":
    main()
