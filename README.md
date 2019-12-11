# Ardublockly ESP8266/ESP32 Micropython Fork

This project is about 
1. Adding Micropython code generator to Ardublockly
2. Adding Micropython WebREPL to Ardublockly 
3. Uploading generated micropython code to ESP8266/ESP32 over the air 

Goal is to make a web based Blockly programming enviroment for programming of ESPs OTA, without installation of any additional software to a PC

## Proof of consept
this project demonstrates uploading generated Micropython code to a ESP8266/ESP32

To get the demo working do as follows:
1. Get an ESP8266/ESP32 board 
2. Flash it with the MicroPython firware using esptool.py https://docs.micropython.org/en/latest/esp8266/tutorial/intro.html
3. open micropython terminal and setup webrepl by typing: import webrepl_setup
4. follow instructions for setuping webrepl
5. (Using uPyCraft IDE) Change internal boot.py file on the ESP8266/ESP32 as:

boot.py

    import network
    import webrepl
    ap = network.WLAN(network.AP_IF)
    ap.active(True)
    webrepl.start()

6. reboot ESP8266/ESP32
7. connect your PC to a ESP_XXXXXX Access point
8. open ardublockly/index.html
9. press connect on the top of the page
10. click on Micropython WebREPL console down left
11. it should ask you for a password you choosed during the webrepl setup
12. after connection build your blockly code as you like, or leave it at the blink sketch as is
13. and for a upload click on the big orange button
14. if is everything connected it should give you a message, that blocks.py was sent
15. reboot the ESP and the sketch should run 


# Ardublockly
Ardublockly is a visual programming editor for Arduino. It is based on Google's [Blockly][1], which has been forked to generate [Arduino][15] code.

The `ArdublocklyServer` Python package initialises a local server to be able to compile and load the Arduino code using the [Arduino IDE][2].

This is all packaged in a self contained executable desktop application for Windows, Mac OS X, and Linux.

![Ardublockly desktop program screenshot][desktop_screeshot]


## Features
* Generates Arduino code with visual drag-and-drop blocks
* Uploads the code to an Arduino Board
* Useful "code block warnings"
* Compatible with a wide range of official Arduino Boards
* Works on Windows / Linux / Mac OS X

Ardublockly is still under development and a few features are not yet implemented. A to-do list can be found in the [TODO.md][3] file.

Currently tested under Windows with Python 2.7 and 3.4 and in Linux and MacOS X with Python 2.7.


## Cloning the repository
Please note that there are submodules in the repository that need initialisation. So, to correctly clone the Ardublockly repository:

```
git clone https://github.com/carlosperate/ardublockly.git
cd ardublockly
git submodule update --init --recursive
```


## Installing
The desktop application is available for Windows/Mac/Linux and runs as a stand-alone executable that can be downloaded from the [Ardublockly repository releases page][4].

You will also need the [Arduino IDE version 1.6.x or higher][2].

#### Development builds
You can also test __UNSTABLE__ development builds automatically generated every time an update is added to the GitHub repository:

| Linux build         | Windows build       | Mac OS X build       |
|:-------------------:|:-------------------:|:--------------------:|
| [![Linux Build Status](https://circleci.com/gh/carlosperate/ardublockly/tree/master.svg?style=svg)](https://circleci.com/gh/carlosperate/ardublockly/tree/master) | [![Windows Build status](https://ci.appveyor.com/api/projects/status/t877g920hdiifc2i?svg=true)](https://ci.appveyor.com/project/carlosperate/ardublockly) | [![Mac Build Status](https://travis-ci.org/carlosperate/ardublockly.svg?branch=master)](https://travis-ci.org/carlosperate/ardublockly) |
| [Download Link][12] | [Download Link][13] | [Download Link][14]  |

#### "Core version" (Python server only)
If you prefer, the core software can be used by running only the Python server, which loads the web interface on your local browser (Chrome recommended).

Full installation instructions for this version can be found in [this Github repository Wiki][5].

The quick version: Clone this repository, initialise all submodules, and execute:

```
python start.py
```

This will work on Windows, Linux (including ARM) and Mac OS X, with Python >2.7 or >3.4


## Running
1. [Install Ardublockly][5].
2. Install the [Arduino IDE][2] version 1.6.x or higher (latest version is always recommended).
3. Run Ardublockly as defined in your installation method.
3. Configure Ardublockly to locate the Arduino IDE [following these instructions][6].


## Online Demos
A demo of the latest release of Ardublockly main interface can be found in the following two links (to load the code into an Arduino it requires the full Ardublockly application to be downloaded and run on your computer):

#### [Ardublockly][10]
![WebApp screenshot responsive design][web_screenshot_responsive]

#### [Ardublockly classic][11]
![WebApp screenshot][web_screenshot_classic]


## Documentation
The documentation, including installation instructions, configuration instructions, and developer information can be found in the [Ardublockly GitHub repository Wiki][7].

To download the documentation you can git clone the wiki data:

```
git clone https://github.com/carlosperate/ardublockly.wiki.git
```


## Credit
This project has been inspired by [BlocklyDuino][16].

Blockly original source is Copyright of Google Inc. [https://developers.google.com/blockly/][1]. A list of changes to the Blockly fork can be found in the [Blockly subdirectory README][17] file.


## License
Copyright (c) 2016 carlosperate https://github.com/carlosperate/

Unless stated otherwise, the source code of this projects is
licensed under the Apache License, Version 2.0 (the "License");
you may not use any of the licensed files within this project
except in compliance with the License.

The full document can be found in the [LICENSE][9] file.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


[1]: https://developers.google.com/blockly/
[2]: http://www.arduino.cc/en/main/software/
[3]: TODO.md
[4]: https://github.com/carlosperate/ardublockly/releases/
[5]: https://github.com/carlosperate/ardublockly/wiki/Installing-Ardublockly
[6]: https://github.com/carlosperate/ardublockly/wiki/Configure-Ardublockly
[7]: https://github.com/carlosperate/ardublockly/wiki
[8]: https://github.com/carlosperate/ardublockly/compare/blockly-original...master
[9]: https://github.com/carlosperate/ardublockly/blob/master/LICENSE
[10]: http://ardublockly.embeddedlog.com/demo/index.html
[11]: http://ardublockly.embeddedlog.com/demo/classic/index.html
[12]: http://ardublockly-builds.s3-website-us-west-2.amazonaws.com/index.html?prefix=linux/
[13]: http://ardublockly-builds.s3-website-us-west-2.amazonaws.com/index.html?prefix=windows/
[14]: http://ardublockly-builds.s3-website-us-west-2.amazonaws.com/index.html?prefix=mac/
[15]: http://www.arduino.cc
[16]: https://github.com/BlocklyDuino/BlocklyDuino
[17]: blockly/README.md

[desktop_screeshot]: http://carlosperate.github.io/ardublockly/images/screenshot_desktop_1.png
[web_screenshot_responsive]: http://carlosperate.github.io/ardublockly/images/screenshot_material_all_small.jpg
[web_screenshot_classic]: http://carlosperate.github.io/ardublockly/images/screenshot_1.png
