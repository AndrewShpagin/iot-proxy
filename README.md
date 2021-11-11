# The IOT-PROXY.COM idea and usage.

![Alt text](iot-proxy.png)


## The problem it solves

You have multiple eWeLink devices. This app allows devices management using the skretch-like UI. 
The app creates and deploys the Google sheet and Google app script that manages your eWeLink devices. No flashing required.

## How  to use?

Just go to https://iot-proxy.com, it is easy-to-use and well documented.

## The usage patterns

This app is intended to manage the eWeLink/Sonoff devices using Scratch-like UI. Generally, you need an eWeLink account and a google account to use this service. First, read the privacy policy to be sure we are not cheating) 
This is the sequence to get it to work:

1) Provide the access to your eWeLink devices. Then you will get the list of devices and will be able to manage them. After you will do that your device’s names will appear inside the blocks.
2) Now you may construct blocks. The result of your job is an auto-generated javascript program that manages your devices. But we never run it. You do this using your Google account!
3) Generally, you may not only operate devices but store data into Google Sheets, handle it, accumulate, send notifications to the Viber or Telegram.
As a result of your job, there is a script that will be run once in some time period. Google allows running the script once in 1 minute, but look how frequently you actually need it.
### There are several ways of using the blocks you constructed:
1) You log in to your Google account using the “Sign In” button on the top. In this case, the IoT-Proxy will be able to create the Google sheet and the script attached to the sheet. To create a sheet and script, press “Google sheets integration” => “Open Google sheets”. The sheet and script will be created automatically if you are given all permissions. Follow the slideshow instructions (press “How it works”) to run and set the trigger to execute the script.
2) Another way is to skip logging into the Google account from the IoT-Proxy. In this case, you need to create the sheet manually. After creating the sheet attach the script using Tools->Script editor in the Sheets menu. Then copy the text of the script using iot-proxy.com -> Google sheets integration -> Copy GS code to clipboard. Then paste the text into the Script editor window. Save, run, assign the triggers as described in the slideshow.
3) The third way is good for you if you are familiar with javascript, you may use the blocks only to discover the API. In this case, follow the previous approach and program the access manually using the functions in the script. It is well documented, it is easy to understand and use. The API reference is there.

### What for is it helpful:
1) Monitor, accumulate the data, statistics from your devices, keep it in Google sheet, draw graphs.
2) React on complex events, like accumulated time of some condition fulfilled.
3) Correctly manage concurrent devices, for example, concurrent heating of the basin and house, for example. For example, if the house is too cold, heat house, not basin even if basin requires heating as well.
4) Organize any complex interaction between devices based on the data, accumulated in the sheet.
5) Just to get familiar with Google Sheets, Google App Script, javascript and extend your knowledge and possibilities. This is superpowerful to operate the Sheets with the script, and Iot-Proxy offers really simple management routines.

### What it may not do:
It may not react immediately. The script called once in some time period (once in a minute is most frequent), so it can’t turn the light immediately when you open the door.


### How you may participate

Any participation is very welcome! It includes:
1) Participation in the development (I may do you the contributor if you want).
2) Testing the application, feedback is welcome.
3) Donations at Patreon, testing, sharing this project! Paying for servers - it is not free to me, so donations are greatly appreciated.
