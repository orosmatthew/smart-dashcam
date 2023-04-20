import time 
from time import sleep
from gpiozero import Buzzer
from threading import Thread, Lock 
import socket
import json


lock = Lock()
UDP_IP = "10.19.8.208"
UDP_PORT = 5005

sock = socket.socket(socket.AF_INET, # Internet
                     socket.SOCK_DGRAM) # UDP
sock.bind((UDP_IP, UDP_PORT))

bz = Buzzer(21)
delay = 0
beeping = False

def buzz():
	global delay, beeping
	while True:
		
		lock.acquire()
		if not beeping:
			lock.release()
			sleep(1)
			continue
			
			
		bz.on()
		d = delay
		lock.release()
		sleep(d)
		bz.off()
		lock.acquire()
		d = delay
		lock.release()
		sleep(d)
		

if __name__ == '__main__':
	t = Thread(target=buzz)
	t.start()
	while True:
			data, addr = sock.recvfrom(1024)
			distance = json.loads(data)['d'] 
			print(distance) 
			lock.acquire()
			delay = 0.9*(distance-10)/347 + 0.1
			beeping = True
			lock.release()
			sleep(0.1)
         #mutex = threading.lock()
