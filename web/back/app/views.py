from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.middleware.csrf import get_token
from models import ModifiedData


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


import numpy as np
import torch
import tritonclient.grpc as grpcclient


def model_handler():
    triton_client = grpcclient.InferenceServerClient(
        url="0.0.0.0:8001"
    )

    # img = (torch.rand(128, 336, 1) * 255)
    img = ModifiedData.objects.get(pk=1)
    input_data = img.numpy().astype(np.float32)
    input_data = input_data.reshape([-1] + list(input_data.shape))
    inputs = [grpcclient.InferInput("keras_tensor", input_data.shape, "FP32")]
    inputs[0].set_data_from_numpy(input_data)
    outputs = [
        grpcclient.InferRequestedOutput("output_0"),
    ]

    result = triton_client.infer(
        model_name="resnet18", inputs=inputs, outputs=outputs
    )
    print(result.as_numpy("output_0"))


def handle_model(request):
    return model_handler()
