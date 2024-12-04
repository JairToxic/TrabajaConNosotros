def organize_data(cv_entities):
    # Crear un diccionario para organizar los datos extraídos
    organized_data = {
        'NAME': [],
        'GOVERNMENT ID': [],
        'DATE OF BIRTH': [],
        'ADDRESS': [],
        'NATIONALITY': [],
        'CIVIL STATUS': [],
        'PHONE NUMBER': [],
        'MAIL': [],
        'FURTHER EDUCATION': [],
        'EDUCATION': {
            'COLLEGE': [],
            'FURTHER EDUCATION': [],
            'CERTIFICATIONS, COURSES, SEMINARS': []
        },
        'PROFESSIONAL EXPERIENCE': [],
        'LANGUAGES': [],
        'RELEVANT PROJECTS': []
    }

    # Recorrer las entidades extraídas para clasificar los datos
    for entity in cv_entities:
        entity_label = entity['entity']
        entity_text = entity['word']
        
        if entity_label == 'I-PER':
            organized_data['NAME'].append(entity_text)
        elif entity_label == 'I-ORG':
            organized_data['PROFESSIONAL EXPERIENCE'].append(entity_text)
        elif entity_label == 'I-LOC':
            organized_data['ADDRESS'].append(entity_text)
        elif entity_label == 'DATE':
            organized_data['DATE OF BIRTH'].append(entity_text)
        # Añadir más condiciones para otros tipos de entidad como "MAIL", "PHONE", etc.
    
    return organized_data
