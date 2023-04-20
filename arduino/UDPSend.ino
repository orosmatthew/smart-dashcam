/*
  UDPSendReceive.pde:
  This sketch receives UDP message strings, prints them to the serial port
  and sends an "acknowledge" string back to the sender

  A Processing sketch is included at the end of file that can be used to send
  and received messages for testing with a computer.

  created 21 Aug 2010
  by Michael Margolis

  This code is in the public domain.

  adapted from Ethernet library examples
*/

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>

#ifndef STASSID
#define STASSID "your-ssid"
#define STAPSK "your-password"
#endif

unsigned int localPort = 8888;  // local port to listen on

// buffers for receiving and sending data
char packetBuffer[UDP_TX_PACKET_MAX_SIZE + 1];  // buffer to hold incoming packet,
char SendBuffer[] = "acknowledged\r\n";        // a string to send back

WiFiUDP Udp;

#include <Ultrasonic.h>
Ultrasonic ultrasonic(12, 13);



void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin("BW_Jacket");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(500);
  }

}

void loop() {
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
    Udp.beginPacket("10.19.8.208", 5005); //Udp.remoteIP(), Udp.remotePort()

      DynamicJsonDocument doc(1024);
      
      int distance = ultrasonic.read();
      doc["d"] = distance;
      char serialized[1024];
      serializeJson(doc, serialized);


      Serial.println(ultrasonic.read() );

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
