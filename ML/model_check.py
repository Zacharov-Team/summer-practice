import onnx

onnx_model = onnx.load("./models/resnet18/1/model.onnx")

# Печать всех входных и выходных узлов
for input_tensor in onnx_model.graph.input:
    print(f"Input Name: {input_tensor.name}, Shape: {[dim.dim_value for dim in input_tensor.type.tensor_type.shape.dim]}")

for output_tensor in onnx_model.graph.output:
    print(f"Output Name: {output_tensor.name}, Shape: {[dim.dim_value for dim in output_tensor.type.tensor_type.shape.dim]}")