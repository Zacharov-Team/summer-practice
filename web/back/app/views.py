import json
import os
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from back.settings import BASE_DIR
from django.shortcuts import redirect


from app.models import *

def log_in(request):
    if request.user.is_authenticated:
        user = request.user
        print(user)
        return JsonResponse({
            'status': 200,
            'user_data': {
                'username': user.username,
                'name': user.first_name,
                'last_name': user.last_name,
                'email': user.email
            }
        })
    if request.method == 'POST':
        request_dict = json.loads(request.body)
        username = request_dict['username']
        password = request_dict['password']

        if not username or not password:
            return JsonResponse({'status': 400, 'error': 'Email and password are required'})
        try:
            user = authenticate(request, username=username, password=password)

            if user is not None:
                try:
                    login(request, user)
                except Exception as e:
                    print(e)
                    return JsonResponse({'status': 500, 'message': 'Error logging in'})
                return JsonResponse({
                    'status': 200,
                    'user_data': {
                        'username': user.username,
                        'name': user.first_name,
                        'last_name': user.last_name,
                        'email': user.email
                    },
                }, safe=False)
            else:
                return JsonResponse({'status': 400, 'message': 'Invalid email or password'})
        except ValidationError as e:
            return JsonResponse({'status': 500, 'message': e.message})
    else:
        return JsonResponse({'status': 401})


import numpy as np
import torch
import tritonclient.grpc as grpcclient
from PIL import Image
import datetime
from django.utils import timezone


def handle_model(request):
    print('ЗАШЛИ СЮДА')
    if not request.user.is_authenticated:
        return JsonResponse({'status': 401})
    print('о мы тебя знаем')

    print(request)
    ownFile = request.FILES.get('img')
    print(ownFile)
    print('1')
    if not ownFile:
        return JsonResponse({'status': 400, 'message': 'No image uploaded'})
    print('2')

    uploaded_image = Uploads.objects.create(file=ownFile)
    file_path = uploaded_image.image.path

    if not os.path.exists(file_path):
        return JsonResponse({'status': 500, 'message': 'Ошибка загрузки файла'})
    print(f'Файл загружен {file_path}')

    triton_client = grpcclient.InferenceServerClient(
        url="0.0.0.0:8001"
    )

    # Путь к файлу изображения
    image_path = os.path.join(BASE_DIR, file_path)

    if not os.path.exists(image_path):
        print(f'Файл {image_path} не найден.')
        return JsonResponse({'status': 500, 'message': 'Ошибка загрузки файла'})

    # Загрузка и подготовка изображения
    img = Image.open(image_path).convert('L')  # конвертация в градации серого
    img = img.resize((336, 128))  # изменение размера изображения
    input_data = np.array(img).astype(np.float32) / 255.0 * 2 - 1  # нормализация как в обучении
    input_data = input_data.reshape(128, 336, 1)

    input_data = input_data.reshape([-1] + list(input_data.shape))

    inputs = [grpcclient.InferInput("keras_tensor", input_data.shape, "FP32")]
    inputs[0].set_data_from_numpy(input_data)

    outputs = [
        grpcclient.InferRequestedOutput("output_0"),
    ]
    print('Обработка изображения')
    result = triton_client.infer(
        model_name="resnet18", inputs=inputs, outputs=outputs
    )
    out = result.as_numpy('output_0')
    # Удаление файла после обработки
    uploaded_image.delete()
    print(f'Файл {file_path} удален.')
    print(f'{out[0].type} -- {out[0].size}')
    return JsonResponse({'status': 200, 'data': out[0].tolist()})


def log_out(request):
    logout(request)
    return JsonResponse({'status': 200})


def get_modified(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 401})

    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if not start_date or not end_date:
        return JsonResponse({'status': 400, 'error': 'start_date and end_date parameters are required.'})

    try:
        modified_data = ModifiedData.objects.filter(date__range=[start_date, end_date]).order_by('id')
        data_list = list(modified_data.values())
        
        return JsonResponse({'status': 200, 'data': data_list}, safe=False)
    except Exception as e:
        return JsonResponse({'status': 500, 'error': str(e)}, status=500)


def get_aggregate(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 401})

    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if not start_date or not end_date:
        return JsonResponse({'status': 400, 'error': 'start_date and end_date parameters are required.'})

    try:
        aggregated_data = AggregatedData.objects.filter(date__range=[start_date, end_date]).order_by('id')
        data_list = list(aggregated_data.values())

        return JsonResponse({'status': 200, 'data': data_list}, safe=False)
    except Exception as e:
        return JsonResponse({'status': 500, 'error': str(e)})


def get_initial(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 401})

    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if not start_date or not end_date:
        return JsonResponse({'status': 400, 'error': 'start_date and end_date parameters are required.'})

    try:
        initial_data = InitialData.objects.filter(date__range=[start_date, end_date]).order_by('id')
        data_list = list(initial_data.values())

        return JsonResponse({'status': 200, 'data': data_list}, safe=False)
    except Exception as e:
        return JsonResponse({'status': 500, 'error': str(e)})
