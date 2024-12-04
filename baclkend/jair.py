import os
import pdfplumber
from transformers import pipeline

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

    # Definir el prompt con el texto extraído del CV
    prompt = f"""
    Eres un asistente de clasificación de currículos (CVs). Tu tarea es organizar el siguiente texto de un CV en categorías específicas, basándote en la información que aparece. Categorías:
    - NAME: El nombre de la persona.
    - GOVERNMENT ID: Identificación gubernamental.
    - DATE OF BIRTH: Fecha de nacimiento.
    - ADDRESS: Dirección.
    - NATIONALITY: Nacionalidad.
    - CIVIL STATUS: Estado civil.
    - PHONE NUMBER: Número de teléfono.
    - MAIL: Correo electrónico.
    - FURTHER EDUCATION: Educación adicional.
    - EDUCATION: Educación (incluye subsecciones como COLLEGE, FURTHER EDUCATION).
    - CERTIFICATIONS, COURSES, SEMINARS: Certificados y cursos.
    - PROFESSIONAL EXPERIENCE: Experiencia profesional.
    - LANGUAGES: Idiomas.
    - RELEVANT PROJECTS: Proyectos relevantes.

    El texto del CV es el siguiente: {cv_text}

    Por favor, devuelve los datos organizados en formato JSON, con las claves que aparecen arriba. Si alguna categoría no se encuentra en el CV, simplemente omítela.
    """

    # Cargar el modelo de Hugging Face
    model = pipeline("text-generation", model="gpt2", truncation=True)

    # Obtener la respuesta del modelo
    response = model(prompt, max_new_tokens=500, num_return_sequences=1)

    # Mostrar la respuesta generada por el modelo
    print("Respuesta del modelo:")
    print(response[0]['generated_text'])

    # Guardar la respuesta en un archivo de texto
    with open("output/classified_cv.json", "w") as outfile:
        outfile.write(response[0]['generated_text'])

    print("Respuesta guardada en output/classified_cv.json")

if __name__ == "__main__":
    main()
