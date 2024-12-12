from flask import Flask, request, jsonify, send_from_directory
import requests
import json
import os
import pdfplumber
from pypdf import PdfReader
from werkzeug.utils import secure_filename
from flask_cors import CORS
import uuid  # Importamos para generar IDs únicos

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

        # Crear el prompt detallado con el texto del CV
        prompt = f"""
Eres un asistente avanzado de procesamiento de CVs. Tu tarea es extraer y estructurar información detallada de un currículum. 

Instrucciones:
1. Procesa toda la información del CV con máximo detalle.
2. Genera un identificador único para el CV.
3. Incluye campos adicionales que puedan enriquecer el perfil profesional.

Estructura JSON esperada:

{{
  "id": "", // Identificador único del CV
  "personalInfo": {{
    "nombre": "",
    "apellido": "",
    "cedula": "",
    "nacionalidad": "",
    "correo": "",
    "telefono": [""], // Array para múltiples números
    "linkedIn": "",
    "aspiracionSalarial": "",
    "tiempoIngreso": "",
    "diaNacimiento": "",
    "estadoCivil": "",
    "direccion": "",
    "foto": "",
    "genero": "",
    "autoidentificacionEtnica": "",
    "discapacidad": {{
      "tieneDiscapacidad": false,
      "tipo": "",
      "porcentaje": ""
    }},
    "expectativasTrabajo": "",
    "actividadesTiempoLibre": "",
    "cantidadHijos": 0
  }},
  "educacion": {{
    "bachillerato": [
      {{
        "grado": "",
        "institucion": "",
        "ano": ""
      }}
    ],
    "educacionSuperiorNoUniversitaria": [
      {{
        "grado": "",
        "institucion": "",
        "anoInicio": "",
        "anoFin": ""
      }}
    ],
    "educacionSuperior": [
      {{
        "grado": "",
        "institucion": "",
        "anoInicio": "",
        "anoFin": ""
      }}
    ],
    "educacionDe4toNivel": [
      {{
        "grado": "",
        "institucion": "",
        "anoInicio": "",
        "anoFin": ""
      }}
    ]
  }},
  "certificaciones": [
    {{
      "curso": "",
      "entidad": "",
      "ano": ""
    }}
  ],
  "experienciaLaboral": [
    {{
      "empresa": "",
      "lugar": "",
      "fechaInicio": "",
      "fechaFin": "",
      "cargo": "",
      "descripcionRol": "",
      "remuneracionBruta": "",
      "beneficios": "",
      "referenciaLaboral": {{
        "nombre": "",
        "cargo": "",
        "telefono": ""
      }}
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
  "logrosRelevantes": [""],
  "competencias": [""],
  "idiomas": [
    {{
      "idioma": "",
      "fluidez": ""
    }}
  ]
}}

Nota importante: 
- Si no hay información para un campo, déjalo como cadena vacía o valor nulo
- Incluye tantos campos como sea posible
- Sé preciso y exhaustivo en la extracción de información

Texto del CV para procesar: {cv_text}
"""

        headers = {"Content-Type": "application/json", "api-key": AZURE_API_KEY}
        payload = {
            "messages": [{"role": "user", "content": prompt}], 
            "max_tokens": 4000,  # Aumentado para mayor capacidad de procesamiento
            "temperature": 0.7
        }

        # Llamada al servicio Azure OpenAI
        response = requests.post(AZURE_API_ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        # Parsear el resultado generado
        generated_text = result["choices"][0]["message"]["content"]

        try:
            # Intentar parsear el JSON generado
            json_response = json.loads(generated_text)
            
            # Generar un ID único si no existe
            if not json_response.get('id'):
                json_response['id'] = str(uuid.uuid4())

            # Añadir imágenes al JSON
            json_response["imagenes"] = images

            # Leer el JSON existente o crear uno nuevo
            try:
                with open("db1.json", "r", encoding='utf-8') as json_file:
                    existing_data = json.load(json_file)
            except (FileNotFoundError, json.JSONDecodeError):
                existing_data = {"cvs": []}

            # Añadir el nuevo CV a la lista de CVs
            existing_data["cvs"].append(json_response)

            # Guardar el JSON actualizado
            with open("db1.json", "w", encoding='utf-8') as json_file:
                json.dump(existing_data, json_file, ensure_ascii=False, indent=4)

            return jsonify(existing_data)
        except json.JSONDecodeError:
            # Si hay error en el JSON, intentar extraer el JSON válido
            import re
            json_match = re.search(r'\{.*\}', generated_text, re.DOTALL)
            if json_match:
                try:
                    json_response = json.loads(json_match.group(0))
                    
                    # Generar un ID único si no existe
                    if not json_response.get('id'):
                        json_response['id'] = str(uuid.uuid4())

                    json_response["imagenes"] = images
                    
                    # Leer el JSON existente o crear uno nuevo
                    try:
                        with open("db1.json", "r", encoding='utf-8') as json_file:
                            existing_data = json.load(json_file)
                    except (FileNotFoundError, json.JSONDecodeError):
                        existing_data = {"cvs": []}

                    # Añadir el nuevo CV a la lista de CVs
                    existing_data["cvs"].append(json_response)
                    
                    # Guardar el JSON generado en el archivo db1.json
                    with open("db1.json", "w", encoding='utf-8') as json_file:
                        json.dump(existing_data, json_file, ensure_ascii=False, indent=4)
                    
                    return jsonify(existing_data)
                except json.JSONDecodeError:
                    return jsonify({"error": "No se pudo procesar el JSON generado", "raw_response": generated_text}), 500
            else:
                return jsonify({"error": "Hubo un error al procesar el JSON generado", "raw_response": generated_text}), 500

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)