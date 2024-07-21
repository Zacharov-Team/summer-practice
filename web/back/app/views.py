from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.middleware.csrf import get_token


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
