import board
import adafruit_lsm9ds1
import time
from configparser import RawConfigParser
from datetime import datetime
import requests
import json

config = RawConfigParser()
config.read('config.conf')
web_url = config['imu']['web_url']

i2c = board.I2C()
sensor = adafruit_lsm9ds1.LSM9DS1_I2C(i2c)

while True:

    now = datetime.utcnow()
    microseconds = (now.microsecond // 100) * 100
    now = now.replace(microsecond=microseconds)
    formatted_time = now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

    gyro_x, gyro_y, gyro_z = sensor.gyro
    accel_x, accel_y, accel_z = sensor.acceleration
    mag_x, mag_y, mag_z = sensor.magnetic
    temp = sensor.temperature

    post_data = {
        'timestamp': formatted_time,
        'gyroX': gyro_x,
        'gyroY': gyro_y,
        'gyroZ': gyro_z,
        'accelX': accel_x,
        'accelY': accel_y,
        'accelZ': accel_z,
        'magX': mag_x,
        'magY': mag_y,
        'magZ': mag_z,
        'temp': temp
    }

    response = requests.post(web_url,
                             data=json.dumps(post_data),
                             headers={'Content-type': 'application/json'})
    print(response)

    time.sleep(1)
