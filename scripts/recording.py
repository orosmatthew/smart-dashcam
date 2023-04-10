import subprocess
import os
import signal
import RPi.GPIO as GPIO
import time

is_recording = False

def start_libcamera_vid():
	if os.path.exists("output.h264"):
		os.remove("output.h264")
	global libcamera_vid_process
	libcamera_vid_process = subprocess.Popen(["libcamera-vid", "-o", "output.h264", "-t", "0", "-v", "0"])


def stop_libcamera_vid():
	global libcamera_vid_process
	os.kill(libcamera_vid_process.pid, signal.SIGINT)

def convert_mp4():
	if os.path.exists("output.mp4"):
		os.remove("output.mp4")
	subprocess.run(["ffmpeg", "-i", "output.h264", "-c:v", "copy", "output.mp4"])

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(23, GPIO.OUT)

while True:
	btn_val = GPIO.input(18)
	if (btn_val == False):
		if is_recording == False:
			print("Starting recording...")
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
			is_recording = False
		time.sleep(2)
		continue
	time.sleep(0.1)


