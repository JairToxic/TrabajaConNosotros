from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import os
import json
import logging
 
app = Flask(__name__)
CORS(app)
 
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
 
AZURE_API_ENDPOINT = "https://mychatbot.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-08-01-preview"
AZURE_API_KEY = "c068c560e2774b0a9318651e846455d6"
 
@app.route('/')
def index():
    return render_template('index.html')
 
@app.route('/procesar_cv', methods=['POST'])
def procesar_cv():
    try:
        logger.debug("Recibiendo solicitud POST en /procesar_cv")
        data = request.get_json()
        logger.debug(f"Datos recibidos: {data}")
 
        job_requirements = data.get('job_requirements', '').strip()
        cv_text = data.get('cv_text', '').strip()
 
        if not job_requirements or not cv_text:
            logger.warning("Campos 'job_requirements' y/o 'cv_text' están vacíos")
            return jsonify({"error": "Los campos 'job_requirements' y 'cv_text' son obligatorios."}), 400
 
        prompt = f"""
### Instrucciones:
A continuación, se te proporcionarán dos secciones:
 
1. **Requisitos del Puesto**:
{job_requirements}
 
2. **Datos del CV**:
{cv_text}
 
Tu tarea es analizar cómo cada requisito del puesto se alinea con los datos proporcionados en el CV. Para cada requisito, asigna una **calificación** (userValue) basada en la alineación entre el CV y el requisito. La calificación debe ser un número que no exceda el porcentaje máximo asignado a cada requisito (maxValue) el userValue NO puede ser mayor que el maxValue.
 
Al final, proporciona un resumen que incluya la **suma de calificaciones**, la **suma de máximos** y la **brecha** entre ambos.
 
Proporciona SOLO la respuesta en formato JSON, sin texto adicional.
 
### **Formato de Respuesta Esperado:**
{{
  "requirements": [
    {{
      "description": "Descripción del requisito",
      "maxValue": 10,
      "userValue": 8
    }},
    ...
  ],
  "summary": {{
    "sumUserValue": 80,
    "sumMaxValue": 100,
    "gap": 20
  }}
}}
"""
 
        logger.debug(f"Prompt construido: {prompt}")
 
        headers = {
            'Content-Type': 'application/json',
            'api-key': AZURE_API_KEY
        }
 
        payload = {
            "messages": [
                {"role": "system", "content": "Eres un asistente que analiza la alineación de requisitos de puestos con datos de CVs. Responde SOLO en formato JSON, sin texto adicional."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 500,
            "temperature": 0.2
        }
 
        logger.debug(f"Enviando solicitud a Azure OpenAI: {payload}")
 
        response = requests.post(AZURE_API_ENDPOINT, headers=headers, json=payload)
        logger.debug(f"Respuesta de Azure OpenAI: Status {response.status_code}, Body: {response.text}")
 
        if response.status_code == 200:
            response_data = response.json()
            assistant_reply = response_data.get('choices', [{}])[0].get('message', {}).get('content', '')
            logger.debug(f"Respuesta de la IA antes del parseo: {assistant_reply}")
 
            try:
                # Encontrar el JSON en la respuesta
                json_start = assistant_reply.find('{')
                json_end = assistant_reply.rfind('}') + 1
               
                if json_start != -1 and json_end != 0:
                    json_string = assistant_reply[json_start:json_end]
                    resultado_json = json.loads(json_string)
                    logger.debug(f"Respuesta JSON parseada exitosamente: {resultado_json}")
                    return jsonify(resultado_json)
                else:
                    logger.error("No se encontró JSON válido en la respuesta")
                    return jsonify({
                        "error": "No se encontró JSON válido en la respuesta",
                        "respuesta_IA": assistant_reply
                    }), 500
 
            except json.JSONDecodeError as e:
                logger.error(f"Error al parsear JSON de la IA: {e}")
                return jsonify({
                    "error": f"Error al parsear JSON: {str(e)}",
                    "respuesta_IA": assistant_reply
                }), 500
        else:
            logger.error(f"Error en la respuesta de Azure OpenAI: {response.status_code}")
            return jsonify({
                "error": "Error al comunicarse con Azure OpenAI.",
                "status_code": response.status_code,
                "detalle": response.text
            }), response.status_code
 
    except Exception as e:
        logger.exception(f"Error inesperado: {e}")
        return jsonify({"error": str(e)}), 500
 
if __name__ == '__main__':
    app.run(debug=True)