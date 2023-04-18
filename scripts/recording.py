import subprocess
import os
import signal
import RPi.GPIO as GPIO
import time
from configparser import RawConfigParser
import shutil
import requests
import json
from datetime import datetime

config = RawConfigParser()
config.read("config.conf")
videos_path = config['recording']['videos_path']
web_url = config['recording']['web_url']

is_recording = False
formatted_time = ""

def start_libcamera_vid():
	if os.path.exists("out/output.h264"):
		os.remove("out/output.h264")
	global libcamera_vid_process
	libcamera_vid_process = subprocess.Popen(["libcamera-vid", "-o", "out/output.h264", "-t", "0", "-v", "0"])


def stop_libcamera_vid():
	global libcamera_vid_process
	os.kill(libcamera_vid_process.pid, signal.SIGINT)

def convert_mp4():
	if os.path.exists("out/output.mp4"):
		os.remove("out/output.mp4")
	subprocess.run(["ffmpeg", "-i", "out/output.h264", "-c:v", "copy", "out/output.mp4"])

def copy_output():
	global filename
	filename = time.strftime('%Y%m%d-%H%M%S') + '.mp4'
	shutil.copyfile("out/output.mp4", os.path.join(videos_path, filename))

def post():
	global filename
	global formatted_time
	data = {
		"timestamp": formatted_time,
		"filename": filename
	}
	response = requests.post(web_url, data=json.dumps(data), headers={'Content-type': 'application/json'})
	print(response)

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(23, GPIO.OUT)

if not os.path.exists("out"):
	os.mkdir("out")

while True:
	btn_val = GPIO.input(18)
	if (btn_val == False):
		if is_recording == False:
			print("Starting recording...")
			now = datetime.utcnow()
			microseconds = (now.microsecond // 100) * 100
			now = now.replace(microsecond=microseconds)
			formatted_time = now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
			start_libcamera_vid()
			print("Recording...")
			GPIO.output(23, GPIO.HIGH)
			is_recording = True
		else:
			print("Stopping recording...")
			stop_libcamera_vid()
			print("Recording stopped")
			GPIO.output(23, GPIO.LOW)
			print("Converting...")
			convert_mp4()
			print("Converting finished")
			print("Copying output...")
			copy_output()
			print("Copied output")
			print("Posting...")
			post()
			print("Posted")
			is_recording = False
		time.sleep(2)
		continue
	time.sleep(0.1)


