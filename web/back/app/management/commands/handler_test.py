from PIL import Image

from app.models import *
import numpy as np
import torch
import tritonclient.grpc as grpcclient
import os
from django.core.management.base import BaseCommand
from back.settings import BASE_DIR

class Command(BaseCommand):
    help = 'Тестирование ручки тритона'

    def add_arguments(self, parser):
        parser.add_argument('type', type=str, help='тип тестирования\n'
                                                   '\trandom - генерация тензора\n'
                                                   '\tpic - берем файл из тестовых данных\n')

    def handle(self, *args, **options):
        triton_client = grpcclient.InferenceServerClient(
            url="0.0.0.0:8001"
        )

        if options['type'] == 'random':
            img = (torch.rand(128, 336, 1)*255)
            input_data = img.cpu().numpy()

        elif options['type'] == 'pic':
            name = input('название файла для тестирования без .png: ')

            if not name:
                name = 'output_image_20210516_0600'

            name += '.png'

            # Путь к файлу изображения
            image_path = os.path.join(BASE_DIR, 'uploads_dataset', name)

            if not os.path.exists(image_path):
                print(f'Файл {image_path} не найден.')
                return

            # Загрузка и подготовка изображения
            img = Image.open(image_path).convert('L')  # конвертация в градации серого
            img = img.resize((336, 128))  # изменение размера изображения
            input_data = np.array(img).astype(np.float32) / 255.0 * 2 - 1  # нормализация как в обучении
            input_data = input_data.reshape(128, 336, 1)

        else:
            print(f'Неизвестный тип тестирования - {options["type"]} ')
            return



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
