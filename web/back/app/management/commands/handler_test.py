from app.models import *
import numpy as np
import torch
import tritonclient.grpc as grpcclient

from django.core.management.base import BaseCommand
from back.settings import BASE_DIR


class Command(BaseCommand):
    def handle(self, *args, **options):
        triton_client = grpcclient.InferenceServerClient(
            url="0.0.0.0:8001"
        )

        img = ModifiedData.objects.get(pk=1)

        input_data = np.array(img.data, dtype=np.float32)

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
