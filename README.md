# ujs-player

ujs-player is a simple and light video player.
thanks to many shortcuts and gestures, it is
ideally suited for use on desktop and
mobile devices. Thanks to good optimization,
it works efficiently on both fast and old
slower devices.

## Basic configuration
```
var player = new UjsPlayer('.ujs-player');

player.load({
  title: 'Demo',
  movies: [
     {
        quality: '<b>QHD</b> 1440p',
        src: 'video_1440.mp4'
     },
     {
        quality: '<b>FHD</b> 1080p',
        src: 'video_1080.mp4',
        default: true
     },
     {
        quality: '<b>HD</b> 720p',
        src: 'video_720.mp4'
     },
     {
        quality: '480p',
        src: 'video_480.mp4'
     }
  ]
});
```
* title is not required
* if the default value is not defined in the movie table, the default
file to load will be the first item in the table

## Event handling
```
player.on('play', function(status) {
  console.log(status)
});
```
| Event name    | Description                                                 |
|---------------|-------------------------------------------------------------|
| play          | When video start playing                                    |
| pause         | When video stop playing                                     |
| forward       | When user rewind video forward                              |
| backward      | When user rewind video backwards                            |
| setTime       | When user changes video time using timeline                 |
| setQuality    | When user changes video quality                             |
| setVolume     | When user changes volume                                    |
| setSpeed      | When user changes video speed                               |
| load          | When video is loaded on first time or after change quality  |
| fullscreen    | When player enters in fullscreen mode                       |
| fullscreenOut | When player exits from fullscreen mode                      |

## Change color theme
```
player.setThemeColor('#52fc03')
```
Available values:
* Any css color value
* 'default' (#01e2b1)

## Change rewind Time
```
player.setRewindTime(10)
```
Available values:
* 5 (default)
* 10
* 30

## Methods
| Method                | Description                                                                             |
|-----------------------|-----------------------------------------------------------------------------------------|
| load(Object)          | Loads a movie with a title and a list of files for different qualities of a given movie |
| playPause()           | If the video is playing, it pauses and if not, it plays                                 |
| timeForward()         | Rewind forward by a set amount (default 5 seconds)                                      |
| timeBackwards()       | Rewind backwards by a set amount (default 5 seconds)                                    |
| setVolume(Number)     | Set volume in percents                                                                  |
| setTime(Number)       | Set time in seconds                                                                     |
| setTimeSpeed(Number)  | Set playback speed. Avaliable values: 0.25, 0.5, 1, 1.5, 2 default is 1                 |
| setColorTheme(String) | Set color theme                                                                         |
| setRewindTime(Number) | Set rewind time. Avaliable values: 5, 10, 30 default is 5                               |
| setQuality(String)    | Set video quality. Loads a video with the given quality name                            |
| volumeUp()            | Set volume by 10% up                                                                    |
| volumeDown()          | Set volume by 10% down                                                                  |
| getStatus()           | Returns status object                                                                   |
| on(String, Function)  | Set callback function to player events                                                  |
| mute()                | On/Off sound                                                                            |
