/*
	MicroView Arduino Flashing Heart Demo
	Copyright (C) 2014 GeekAmmo

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
#include <MicroView.h>

unsigned long number;

void setup() {
  uView.begin();
  uView.clear(PAGE);
  uView.setFontType(3);
  randomSeed(analogRead(A0));
  Serial.begin(9600);
}

void loop() {
  uView.clear(PAGE);
  uView.setCursor(0,0);
  number = random(100000);
  uView.print(number);
  uView.display();
  Serial.println(number);
  delay(2000);
}
