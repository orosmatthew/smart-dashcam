#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <Ultrasonic.h>

#include "env.h"

unsigned int localPort = 8888; // local port to listen on

// buffers for receiving and sending data
char packetBuffer[UDP_TX_PACKET_MAX_SIZE + 1]; // buffer to hold incoming packet,
char SendBuffer[] = "acknowledged\r\n";        // a string to send back

WiFiUDP Udp;

Ultrasonic ultrasonic(12, 13);

void setup()
{
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print('.');
    delay(500);
  }
}

void loop()
{
  // if there's data available, read a packet
  /*
  int packetSize = Udp.parsePacket();
  if (packetSize) {
    Serial.printf("Received packet of size %d from %s:%d\n    (to %s:%d, free heap = %d B)\n", packetSize, Udp.remoteIP().toString().c_str(), Udp.remotePort(), Udp.destinationIP().toString().c_str(), Udp.localPort(), ESP.getFreeHeap());
*/
  // read the packet into packetBufffer
  /*
  int n = Udp.read(packetBuffer, UDP_TX_PACKET_MAX_SIZE);
  packetBuffer[n] = 0;
  Serial.println("Contents:");
  Serial.println(packetBuffer);
*/

  // send a reply, to the IP address and port that sent us the packet we received
  Udp.beginPacket("192.168.0.75", 5005); // Udp.remoteIP(), Udp.remotePort()

  DynamicJsonDocument doc(1024);

  int distance = ultrasonic.read();
  doc["d"] = distance;
  char serialized[1024];
  serializeJson(doc, serialized);

  Serial.println(ultrasonic.read());

  Udp.write(serialized);
  Udp.endPacket();

  //}
  delay(200);
}

/*
  test (shell/netcat):
  --------------------
    nc -u 192.168.esp.address 8888
*/
