# summer-practice
___

.gitignore взят с https://www.toptal.com/developers/gitignore/

## web-back
Создаем виртуальное окружение

```bash
python3 -m venv venv
```
активация 
```bash
source venv/bin/activate
```
Для проверки корректности:
```bash
which python3
# ~/.../<DIR-NAME>/venv/bin/python3 - корректный вывод
```

## Работа с зависимостями

Для фиксации зависимостей, для этого нужно создать файл `requirements.txt`
```bash
pip freeze > requirements.txt
```

Для того, чтобы скачать зависимости:
```bash
pip install -r requirements.txt
```

### Создание django проекта
Установка
```bash
pip3 install django 
```

```bash
django-admin startproject <PROJ_NAME>
```

 
