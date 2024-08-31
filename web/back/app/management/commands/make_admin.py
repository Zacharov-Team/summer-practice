
from django.core.management.base import BaseCommand


from django.contrib.auth.models import User
from django.utils import timezone


class Command(BaseCommand):
    def handle(self, *args, **options):
        user = User.objects.create_user(
            username=input('введите имя пользователя: '),
            password=input('введите пароль: '),
            last_login=timezone.now(),
            is_superuser=True,
            is_staff=True
        )

        user.save()
