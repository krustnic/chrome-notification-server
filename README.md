# Chrome Notification Server

It is a Chrome Application availible in [Chrome Store](https://chrome.google.com/webstore/detail/cahgolnbmcechdpojohdlcjbnhadfbne/publish-delayed?utm_source=chrome-ntp-icon), which creates HTTP server in Chrome that catch all requests on port (by deafult 8989) and proxies it as options to 
[chrome.notifications.create](https://developer.chrome.com/apps/notifications#method-create). So you can use Chrome browser as a Notification server from your application.

## How to use

From external application you should send http request to localhost:8989. 8989 - is default port and you can change it in chrome application settings (launch button). Http request can use any method (server is not a real http). Request body should be JSON of the following form:
```json
{
    "command" : "string",
    "data"    : "string"
}
```
For now there are two available commands: 
* `ping` - in response your get a string "chrome-notification-server" (can be used to determine that server exists). "data" parameter should be an empty string.
* `notification` - shows chrome notification. "data" parameter should be a valid options object for  [chrome.notifications.create](https://developer.chrome.com/apps/notifications#method-create) API. The only difference is that if the `iconUrl` property does not exist there is no error and default icon is used. If you want your own image you can set `iconUrl` as [data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs) string.

## Example
1. Install chrome application from [chrome store](https://chrome.google.com/webstore/detail/cahgolnbmcechdpojohdlcjbnhadfbne/publish-delayed?utm_source=chrome-ntp-icon)
2. Send http request from somewhere, for example `curl`:
```sh
curl --data '{"command":"notifications","data": { "type":"basic", "title":"Message", "message":"Hello!" } }' localhost:8989
```
That's all, notification will be shown. For example of working with Chrome Notification Server from `node` checkout folder `examples`.

## Build
Create zip archive:
```sh
grunt production
```