from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

vacancies = [
    {
        "id": 1,
        "position_id": 101,
        "position_name": "Desarrollador Backend",
        "description": "Desarrollo de APIs y microservicios con Flask. Conocimientos avanzados en Python, manejo de bases de datos relacionales y arquitectura de microservicios.",
        "benefits": "Trabajo remoto, Seguro médico, Bonos de desempeño"
    },
    {
        "id": 2,
        "position_id": 102,
        "position_name": "Desarrollador Frontend",
        "description": "Desarrollo de interfaces de usuario con React. Experiencia en diseño responsivo, manejo de estados con Redux y consumo de APIs REST.",
        "benefits": "Horario flexible, Capacitación continua"
    },
    # ... otras vacantes
]

def get_ranked_vacancies(query):
    documents = [f"{vacancy['position_name']} {vacancy['description']} {vacancy['benefits']}" for vacancy in vacancies]
    vectorizer = TfidfVectorizer(stop_words='english')
    all_text = documents + [query]
    tfidf_matrix = vectorizer.fit_transform(all_text)
    cosine_similarities = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])
    ranked_vacancies = []
    for idx, similarity in enumerate(cosine_similarities[0]):
        ranked_vacancies.append({**vacancies[idx], 'similarity': similarity})
    ranked_vacancies = sorted(ranked_vacancies, key=lambda x: x['similarity'], reverse=True)
    return ranked_vacancies

@app.route('/ranked-vacancies', methods=['POST'])
def ranked_vacancies():
    data = request.get_json()
    query = data.get('query', '')
    if query:
        ranked_vacancies_list = get_ranked_vacancies(query)
        return jsonify(ranked_vacancies_list)
    else:
        return jsonify({"error": "La consulta es necesaria"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)
