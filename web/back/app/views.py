import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.middleware.csrf import get_token


from app.models import *


def log_in(request):
    if request.method == 'POST':
        request_dict = json.loads(request.body)
        email = request_dict['email']
        password = request_dict['password']
        print(email, password)
        if not email or not password:
            return JsonResponse({'status': 400, 'error': 'Email and password are required'})
        try:
            user = authenticate(request, email=email, password=password)
            print(user)
            if user is not None:
                login(request, user)
                return JsonResponse({
                    'status': 200,
                    'username': user.username,
                    'name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email}
                )
            else:
                return JsonResponse({'status': 400, 'message': 'Invalid email or password'})
        except ValidationError as e:
            return JsonResponse({'status': 500, 'message': e.message})

    if request.method == 'GET':
        csrf_token = get_token(request)
        return JsonResponse({'status': 200, 'csrf_token': csrf_token})


import numpy as np
import torch
import tritonclient.grpc as grpcclient
from PIL import Image
import datetime
from django.utils import timezone

@login_required(login_url='login')
def handle_model(request):
    file = request.FILES.get('img')
    if not file:
        return JsonResponse({'status': 'error', 'message': 'No image uploaded'})
    triton_client = grpcclient.InferenceServerClient(
        url="0.0.0.0:8001"
    )

    img = Image.open(file)
    input_data = img.cpu().numpy().astype(np.float32)
    input_data = input_data.reshape([-1] + list(input_data.shape))
    inputs = [grpcclient.InferInput("keras_tensor", input_data.shape, "FP32")]
    inputs[0].set_data_from_numpy(input_data)
    outputs = [
        grpcclient.InferRequestedOutput("output_0"),
    ]

    result = triton_client.infer(
        model_name="resnet18", inputs=inputs, outputs=outputs
    )
    out = result.as_numpy()
    print(out)

    md = ModifiedData.objects.create(data=out.tolist(), date=timezone.now())
    md.save()
    res = {"result": out.tolist()}

    return res


def log_out(request):
    logout(request)
    return JsonResponse({'status': 200})


@login_required(login_url='login')
def get_modified(request):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if not start_date or not end_date:
        return JsonResponse({'status': 400, 'error': 'start_date and end_date parameters are required.'})

    try:
        modified_data = ModifiedData.objects.filter(date__range=[start_date, end_date])
        data_list = list(modified_data.values())
        return JsonResponse({'status': 200, 'data': data_list}, safe=False)
    except Exception as e:
        return JsonResponse({'status': 500, 'error': str(e)}, status=500)


def get_aggregate(request):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if not start_date or not end_date:
        return JsonResponse({'status': 400, 'error': 'start_date and end_date parameters are required.'})

    try:
        aggregated_data = AggregatedData.objects.filter(date__range=[start_date, end_date])
        data_list = list(aggregated_data.values())

        return JsonResponse({'status': 200, 'data': data_list}, safe=False)
    except Exception as e:
        return JsonResponse({'status': 500, 'error': str(e)})
