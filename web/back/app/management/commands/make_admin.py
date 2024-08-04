from app.models import *
import csv
from django.db.utils import IntegrityError
import os
from django.core.management.base import BaseCommand
from back.settings import BASE_DIR

from django.contrib.auth.models import User
from django.utils import timezone
from environs import Env


class Command(BaseCommand):
    def handle(self, *args, **options):
        env = Env()
        env.read_env()
        user = User.objects.create_user(
            username=env('DB_USER'),
            password=env('DB_PASSWORD'),
            last_login=timezone.now(),
            is_superuser=True,
            is_staff=True
        )
        user.save()
