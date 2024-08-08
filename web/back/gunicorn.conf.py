# gunicorn.conf.py

import multiprocessing

# Основные параметры
bind = "0.0.0.0:8000"  # Привязка к адресу и порту
workers = 10  # Количество воркеров
worker_class = "sync"  # Тип воркера (sync, gevent, etc.)
timeout = 30  # Таймаут запроса в секундах

# Дополнительные параметры
loglevel = "info"  # Уровень логирования (debug, info, warning, error, critical)
accesslog = "-"  # Лог доступа ("-" для вывода в stdout)
errorlog = "-"  # Лог ошибок ("-" для вывода в stdout)
capture_output = True  # Перенаправление вывода stdout/stderr в лог

# Дополнительно можно указать количество потоков для каждого воркера
threads = 2  # Количество потоков на воркер
