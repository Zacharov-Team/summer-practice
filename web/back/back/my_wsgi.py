def simple_app(environ, start_response):
    """Простое WSGI-приложение для вывода GET и POST параметров."""
    status = "200 OK"
    headers = [("Content-Type", "text/plain; charset=utf-8")]
    start_response(status, headers)

    # Парсинг параметров GET
    query_string = environ.get('QUERY_STRING', '')
    get_params = dict(param.split('=') for param in query_string.split('&') if '=' in param)

    # Парсинг параметров POST
    try:
        request_body_size = int(environ.get('CONTENT_LENGTH', 0))
    except (ValueError):
        request_body_size = 0

    request_body = environ['wsgi.input'].read(request_body_size).decode('utf-8')
    post_params = dict(param.split('=') for param in request_body.split('&') if '=' in param)

    # Формирование ответа
    response = ["GET parameters:\n"]
    for key, value in get_params.items():
        response.append(f"{key}: {value}\n")

    response.append("\nPOST parameters:\n")
    for key, value in post_params.items():
        response.append(f"{key}: {value}\n")

    return [str.encode("".join(response))]

# Запуск с Gunicorn
# gunicorn -b 127.0.0.1:8081 simple_wsgi:simple_app
