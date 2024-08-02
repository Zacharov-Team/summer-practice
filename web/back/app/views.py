from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.middleware.csrf import get_token
from django.shortcuts import redirect
from django.urls import reverse

from app.models import *


def log_in(request):
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'})
        try:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({
                    'status': 'success',
                    'message': 'Logged in successfully',
                    'username': user.username,
                    'name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email}
                )
            else:
                return JsonResponse({'status': 'error',
                                     'message': 'Invalid username or password'})
        except ValidationError as e:
            return JsonResponse({'status': 'error',
                                 'message': e.message})

    if request.method == 'GET':
        csrf_token = get_token(request)
        return JsonResponse({'csrf_token': csrf_token})


# import numpy as np
# import torch
# import tritonclient.grpc as grpcclient
# from PIL import Image
# import datetime
# from django.utils import timezone
#
# @login_required(login_url='login')
# def handle_model(request):
#     file = request.FILES.get('img')
#     if not file:
#         return JsonResponse({'status': 'error', 'message': 'No image uploaded'})
#     triton_client = grpcclient.InferenceServerClient(
#         url="0.0.0.0:8001"
#     )
#
#     img = Image.open(file)
#     input_data = img.cpu().numpy().astype(np.float32)
#     input_data = input_data.reshape([-1] + list(input_data.shape))
#     inputs = [grpcclient.InferInput("keras_tensor", input_data.shape, "FP32")]
#     inputs[0].set_data_from_numpy(input_data)
#     outputs = [
#         grpcclient.InferRequestedOutput("output_0"),
#     ]
#
#     result = triton_client.infer(
#         model_name="resnet18", inputs=inputs, outputs=outputs
#     )
#     out = result.as_numpy()
#     print(out)
#
#     md = ModifiedData.objects.create(data=out.tolist(), date=timezone.now())
#     md.save()
#     res = {"result": out.tolist()}
#
#     return res


def log_out(request):
    logout(request)
    return redirect(reverse('login'))


@login_required(login_url='login')
def get_modified(request):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if not start_date or not end_date:
        return JsonResponse({'error': 'start_date and end_date parameters are required.'}, status=400)

    try:
        modified_data = ModifiedData.objects.filter(date__range=[start_date, end_date])
        data_list = list(modified_data.values())
        return JsonResponse(data_list, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required(login_url='login')
def get_aggregate(request):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if not start_date or not end_date:
        return JsonResponse({'error': 'start_date and end_date parameters are required.'}, status=400)

    try:
        aggregated_data = AggregatedData.objects.filter(date__range=[start_date, end_date])
        data_list = list(aggregated_data.values())

        return JsonResponse(data_list, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
