from flask import Flask, request, jsonify, send_from_directory
import requests
import json
import os
import pdfplumber
from pypdf import PdfReader
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilitar CORS para solicitudes del cliente

# Ruta para guardar imágenes temporalmente
TEMP_IMAGE_FOLDER = "temp_images"
os.makedirs(TEMP_IMAGE_FOLDER, exist_ok=True)

# Configuración de Azure OpenAI
AZURE_API_ENDPOINT = "https://mychatbot.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-08-01-preview"
AZURE_API_KEY = "c068c560e2774b0a9318651e846455d6"

# Función para extraer texto del PDF
def extract_text_from_pdf(pdf_file):
    with pdfplumber.open(pdf_file) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""  # Manejo de páginas sin texto
    return text

def extract_images_from_pdf(pdf_file):
    reader = PdfReader(pdf_file)
    images = []
    for page_number, page in enumerate(reader.pages):
        for count, image_file_object in enumerate(page.images):
            # Generar un nombre único para la imagen
            image_filename = f"page_{page_number}_image_{count}_{secure_filename(image_file_object.name)}"
            image_path = os.path.join(TEMP_IMAGE_FOLDER, image_filename)

            # Guardar la imagen en el servidor
            with open(image_path, "wb") as fp:
                fp.write(image_file_object.data)

            # Usar una URL absoluta con el host real
            base_url = request.host_url.rstrip('/')  # Obtiene la URL base del host
            images.append({
                "filename": image_file_object.name,
                "page": page_number,
                "path": f"{base_url}/temp_images/{image_filename}"  # URL absoluta
            })
    return images

# Ruta para servir imágenes desde la carpeta temp_images
@app.route('/temp_images/<path:filename>')
def serve_image(filename):
    return send_from_directory(TEMP_IMAGE_FOLDER, filename)

# Ruta principal para procesar PDF
@app.route('/api/generate', methods=['POST'])
def generate_response():
    try:
        if 'pdf_file' not in request.files:
            return jsonify({"error": "El archivo PDF es requerido"}), 400

        pdf_file = request.files['pdf_file']

        # Extraer texto del PDF
        cv_text = extract_text_from_pdf(pdf_file)
        if not cv_text.strip():
            return jsonify({"error": "No se pudo extraer texto del archivo PDF"}), 400

        # Extraer imágenes del PDF
        images = extract_images_from_pdf(pdf_file)

        # Crear el prompt con el texto del CV
        prompt = f"""
Eres un asistente de clasificación de currículos (CVs). Tu tarea es organizar el siguiente texto de un CV en categorías específicas, basándote en la información que aparece. Categorías:
- PERSONAL INFO: Información personal (nombre, apellido, fecha de nacimiento, cédula, nacionalidad, estado civil, teléfono, correo, dirección, foto).
- EDUCATION: Educación (bachillerato y educación superior, incluyendo grados, instituciones y fechas).
- CERTIFICATIONS: Certificaciones (incluyendo nombre del curso, entidad y año).
- WORK EXPERIENCE: Experiencia laboral (empresa, lugar, fechas, cargo, descripción de la empresa y actividades).
- RELEVANT PROJECTS: Proyectos relevantes (incluyendo proyecto, cliente, rol, año, partner y descripción).
- LANGUAGES: Idiomas (idioma y fluidez).
- ID: Identificador único del CV.

El texto del CV es el siguiente: {cv_text}

Devuelve los datos organizados en formato JSON con la siguiente estructura. Asegúrate de que todos los campos estén presentes, incluso si no hay datos disponibles, utiliza valores vacíos o nulos. Las categorías como educación, experiencia laboral, proyectos y idiomas pueden tener más de un elemento en una lista. Si alguna categoría no está presente, omítela del JSON.

La estructura esperada es:

{{
  "cvs": [
    {{
      "personalInfo": {{
        "nombre": "",
        "apellido": "",
        "nacimiento": "",
        "cedula": "",
        "nacionalidad": "",
        "estadoCivil": "",
        "telefono": "",
        "correo": "",
        "direccion": "",
        "foto": ""
      }},
      "educacion": {{
        "bachillerato": [
          {{"grado": "", "institucion": "", "ano": ""}}
        ],
        "educacionSuperior": [
          {{"grado": "", "institucion": "", "anoInicio": "", "anoFin": ""}}
        ]
      }},
      "certificaciones": [
        {{"curso": "", "entidad": "", "ano": ""}}
      ],
      "experienciaLaboral": [
        {{
          "empresa": "",
          "lugar": "",
          "fechaInicio": "",
          "fechaFin": "",
          "cargo": "",
          "descripcionEmpresa": "",
          "actividades": ["", "", ""]
        }}
      ],
      "proyectosRelevantes": [
        {{
          "proyecto": "",
          "cliente": "",
          "rol": "",
          "ano": "",
          "partner": "",
          "descripcion": ""
        }}
      ],
      "idiomas": [
        {{"idioma": "", "fluidez": ""}}
      ],
      "id": ""
    }}
  ]
}}
"""

        headers = {"Content-Type": "application/json", "api-key": AZURE_API_KEY}
        payload = {"messages": [{"role": "user", "content": prompt}], "max_tokens": 2000, "temperature": 0.7}

        # Llamada al servicio Azure OpenAI
        response = requests.post(AZURE_API_ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        # Parsear el resultado generado
        generated_text = result["choices"][0]["message"]["content"]

        try:
            json_response = json.loads(generated_text)
            json_response["imagenes"] = images  # Agregar imágenes al JSON

            # Guardar el JSON generado en el archivo db1.json
            with open("db1.json", "w") as json_file:
                json.dump(json_response, json_file, ensure_ascii=False, indent=4)

            return jsonify(json_response)
        except json.JSONDecodeError:
            return jsonify({"error": "Hubo un error al procesar el JSON generado"}), 500

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
