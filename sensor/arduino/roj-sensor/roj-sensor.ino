#include <Bridge.h>
void setup()
{
    Bridge.begin();     // this launches /usr/bin/run-bride on Linino
    pinMode(8,OUTPUT);
    pinMode(A0,INPUT);
    pinMode(A1,INPUT);
}

float voltToDistance(float volt)
{
  float reference[41][2] = {
    {2.58,100.0},
    {2.55,102.5},
    {2.52,105.0},
    {2.5,107.0},
    {2.47,110.0},
    {2.44,112.5},
    {2.41,115.0},
    {2.39,117.5},
    {2.37,120.0},
    {2.34,122.5},
    {2.31,125.0},
    {2.29,127.5},
    {2.27,130.0},
    {2.25,132.5},
    {2.23,135.0},
    {2.21,137.5},
    {2.19,140.0},
    {2.17,142.5},
    {2.15,145.0},
    {2.13,147.5},
    {2.12,150.0}, 
    {2.09,155.0},
    {2.06,160.0},
    {2.03,165.0},
    {2.00,170.0},
    {1.98,175.0},
    {1.95,180.0},
    {1.94,185.0},
    {1.92,190.0},
    {1.90,195.0},
    {1.88,200.0},
    {1.87,205.0},
    {1.85,210.0},
    {1.83,215.0},
    {1.82,220.0},
    {1.81,225.0},
    {1.79,230.0},
    {1.78,235.0},
    {1.77,240.0},
    {1.76,245.0},
    {1.75,250.0}     
  };

  int nearest_low = -1;
  int nearest_high = -1;

  for(int i=0;i<31;i++) {
    if (volt < reference[i][0])
      nearest_low = i;
    if (volt > reference[i][0])
      nearest_high = i;

  }

  if (nearest_low < 0.0 || nearest_high < 0.0)
    return -100.0;


  float per = (reference[nearest_high][0] - reference[nearest_low][0]) / (reference[nearest_high][0] - volt);
  return reference[nearest_low][1] + (5.0 * per);
}

float aread(int pin)
{

    int proxSens = analogRead(pin);
    
    float volts = (((float)proxSens) * (5000.0 / 1024.0)) / 1000.0 ; // ("proxSens" is from analog read)
    return volts;

}

void loop()
{
    int count = 0;
    float sum = 0.0;
    for(int i=0;i<5;i+=1) {
      float d = voltToDistance(aread(A0));
      if ( d > 0.0) {
        sum += d;
        count += 1;
      }
      delay(50);
      
    }

    
    float mean = sum / ((float) count);
   
      Bridge.put("s1",String(mean / 100.0));
      Bridge.put("s2",String(mean / 100.0));
    

    digitalWrite(8,HIGH);
    delay(100);
    digitalWrite(8,LOW);
}
