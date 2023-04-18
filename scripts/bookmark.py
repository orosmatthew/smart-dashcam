import RPi.GPIO as GPIO
from configparser import RawConfigParser
import requests
import time
from datetime import datetime
import json

config = RawConfigParser()
config.read("config.conf")
web_url = config['bookmark']['web_url']

GPIO.setmode(GPIO.BCM)
GPIO.setup(24, GPIO.IN, pull_up_down=GPIO.PUD_UP)

while True:
    btn_val = GPIO.input(24)
    if (btn_val == False):
        now = datetime.utcnow()
        microseconds = (now.microsecond // 100) * 100
        now = now.replace(microsecond=microseconds)
        formatted_time = now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        
        post_data = {
            'timestamp': formatted_time
        }
        
        response = requests.post(web_url, 
                                 data=json.dumps(post_data),
                                 headers={'Content-type': 'application/json'})
        print(response)
        time.sleep(2)
    else:
        time.sleep(0.1)
