import os
import csv
import tensorflow as tf
import seaborn as sns
import matplotlib.pyplot as plt
import plotly.express as px
import pandas as pd
import numpy as np
import sklearn as sk
from keras.models import Sequential
from tensorflow.keras.layers import Input, DepthwiseConv2D
from keras.layers import Conv2D, MaxPooling2D, MaxPooling3D, Flatten, Dense, Dropout, Input
from keras.preprocessing.image import load_img, img_to_array
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MinMaxScaler, StandardScaler, MaxAbsScaler, Normalizer
from sklearn.metrics import f1_score, classification_report, accuracy_score, precision_recall_curve, roc_curve, ConfusionMatrixDisplay
from sklearn.utils import shuffle
from datetime import datetime
from keras.callbacks import TensorBoard, Callback
import warnings
import onnx
import tf2onnx
import onnxruntime as rt

# warnings.filterwarnings("ignore")

pd.set_option("display.max_columns", None)
plt.rcParams["figure.figsize"] = (10, 6)

RANDOM_SEED = 2022

log_dir = "logs/fit/" + datetime.now().strftime("%Y%m%d-%H%M%S")
tensorboard_callback = TensorBoard(log_dir=log_dir, histogram_freq=1)

config = {
    "batch_size": 48,
    "epochs": 100,
    "dropout": 0.5,
    "layer_1": 4,
    "layer_2": 8,
    "layer_3": 12,
    "layer_4": 16,
    "dense2_layer": 1024,
    "dense1_layer": 256,
    "optimizer": "adam",
    "loss": "mse",   # binary_crossentropy
    "metric": "r2_score",  # accuracy
    "l_rate": 0.1,
    "optimizer_momentum": 0.9
}

image_folder = 'pics_grey'
csv_file = 'new_df_two.csv'

df = pd.read_csv(csv_file, index_col=0)

def parse_date_from_filename(filename):
    date_str = filename.split('_')[2]
    time_str = filename.split('_')[3][:4]
    formatted_date = f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:]} {time_str[:2]}:00:00"
    return formatted_date

def data_generator(image_folder, df, filenames, batch_size):
    num_samples = len(filenames)
    while True:
        for offset in range(0, num_samples, batch_size):
            batch_filenames = filenames[offset:offset + batch_size]
            images = []
            labels = []
            for filename in batch_filenames:
                if filename.endswith(".png"):
                    date_str = parse_date_from_filename(filename)
                    img_path = os.path.join(image_folder, filename)
                    img = load_img(img_path, target_size=(128, 336), color_mode='grayscale')
                    img_array = (img_to_array(img)) / 255.0 * 2 - 1
                    if date_str in df.index:
                        images.append(img_array)
                        labels.append(df.loc[date_str].values)
            yield np.array(images), np.array(labels)

filenames = os.listdir(image_folder)
dates = [parse_date_from_filename(f) for f in filenames if f.endswith(".png")]

data = pd.DataFrame({'filename': filenames, 'date': dates})
data['date'] = pd.to_datetime(data['date'])
data = data.sort_values(by='date')

train_data = data[data['date'] < '2024-04-01']
test_data = data[data['date'] >= '2024-04-01']

train_filenames = train_data['filename'].tolist()
test_filenames = test_data['filename'].tolist()

batch_size = config["batch_size"]
train_gen = data_generator(image_folder, df, train_filenames, batch_size)
test_gen = data_generator(image_folder, df, test_filenames, batch_size)

model = Sequential([
    Input(shape=(128, 336, 1)),
    Conv2D(config["layer_1"], (4, 1), activation='tanh', strides=(4, 1)),
    MaxPooling2D((4, 1)),
    Conv2D(config["layer_1"], (1, 1), activation='tanh'),
    Conv2D(config["layer_2"], (1, 4), activation='tanh'),
    MaxPooling2D((1, 4)),
    Conv2D(config["layer_2"], (1, 1), activation='tanh'),
    Conv2D(config["layer_3"], (1, 4), activation='tanh'),
    MaxPooling2D((1, 4)),
    Conv2D(config["layer_3"], (1, 1), activation='tanh'),
    Conv2D(config["layer_4"], (4, 1), activation='tanh'),
    MaxPooling2D((4, 1)),
    Conv2D(config["layer_4"], (1, 1), activation='tanh'),
    Flatten(),
    Dense(64, activation='tanh'),
])

print(model.summary())

model.compile(optimizer=config["optimizer"], loss=config["loss"], metrics=[config["metric"]])

steps_per_epoch = len(train_filenames) // batch_size
validation_steps = len(test_filenames) // batch_size

class CSVLogger(Callback):
    def init(self, filename, separator=',', append=False):
        self.filename = filename
        self.sep = separator
        self.append = append
        self.writer = None
        self.keys = None
        self.append_header = True
        super(CSVLogger, self).init()

    def on_train_begin(self, logs=None):
        if self.append:
            if os.path.exists(self.filename):
                with open(self.filename, 'r') as f:
                    self.append_header = not bool(len(f.readline()))
        self.csv_file = open(self.filename, mode='a' if self.append else 'w')
        self.writer = None
        self.keys = None

    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}

        def handle_value(k):
            is_zero_dim_ndarray = isinstance(k, np.ndarray) and k.ndim == 0
            if isinstance(k, (np.float64, np.float32)):
                return '%0.5f' % k
            elif is_zero_dim_ndarray:
                return '%0.5f' % k.item()
            else:
                return k

        if self.keys is None:
            self.keys = sorted(logs.keys())
            if self.model is not None:
                self.keys = ['epoch'] + self.keys

        if self.writer is None:
            class CustomDialect(csv.excel):
                delimiter = self.sep

            self.writer = csv.DictWriter(self.csv_file, fieldnames=self.keys, dialect=CustomDialect)
            if self.append_header:
                self.writer.writeheader()

        logs['epoch'] = epoch
        row_dict = {k: handle_value(logs[k]) for k in self.keys}
        self.writer.writerow(row_dict)
        self.csv_file.flush()

    def on_train_end(self, logs=None):
        self.csv_file.close()
        self.writer = None
        self.keys = None

#csv_logger = CSVLogger('training_log.csv', append=True)

history = model.fit(train_gen,
                    steps_per_epoch=steps_per_epoch,
                    epochs=config["epochs"],
                    validation_data=test_gen,
                    validation_steps=validation_steps,
                    callbacks=[tensorboard_callback
                            #, csv_logger
                               ])

# Сохранение модели в формате ONNX
onnx_model_path = "model.onnx"
spec = (tf.TensorSpec((None, 128, 336, 1), tf.float32, name="input"),)
model_proto, _ = tf2onnx.convert.from_keras(model, input_signature=spec, opset=13, output_path=onnx_model_path)
print(f"Model saved to {onnx_model_path}")
