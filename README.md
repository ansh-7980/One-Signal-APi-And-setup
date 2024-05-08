firstly go to onesignal docs.
follow the steps required in docz changes the xcode config by adding capabilityes like add bundleIdentifier.onesignal
after dont forgot to enable the extension in build phases otherwise you will get the mismatched bundle Id's error.
then setup one signal account and activate the google android FCM for android notifications.
then connect with firebase and enable the cloud messaging and download the json file from there and then setup is done.
after do the setup of ios and same procedure will be follows.
then you can handle code in app Navigator and then api will be call and boom notifications arrived successfully.
