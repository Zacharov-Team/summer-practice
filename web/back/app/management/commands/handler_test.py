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
        parser.add_argument('type', type=int, help='тип тестирования\n'
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
            filepath = os.path.join(BASE_DIR, "uploads_dataset", "df_diff2.csv")
            img = Image.open(filepath)
            input_data = np.array(img.data, dtype=np.float32)


        else:
            print('Неизвестный тип тестирования')
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
