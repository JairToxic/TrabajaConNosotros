from transformers import pipeline

# Inicializamos el pipeline de NER (Reconocimiento de Entidades Nombradas)
ner_pipeline = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")

# Función para extraer entidades del texto usando el modelo de Hugging Face
def extract_entities_with_ner(text):
    entities = ner_pipeline(text)
    return entities

# Ejemplo de texto (esto lo tendrás que cambiar por el texto extraído de tu CV)
cv_text = "Aquí va el texto extraído desde el CV"  # Este es un ejemplo
cv_entities = extract_entities_with_ner(cv_text)

# Mostrar las entidades detectadas
for entity in cv_entities:
    print(entity)
