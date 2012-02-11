# Music Hack Day SF 2012

Nat and Reed have some plans for this event. Email them if you're interested in helping out:

  * <nat@natwelch.com>
  * <reed.morse@gmail.com>

## What this is

Mixboard.fm is an app for remixing music. It has two components, the Console and the Mixboard.

### Console

The Console is an instrument for live mixing.

### Mixboard

The Mixboard records your live mixing for future editing. The Mixboard also lets other people listen to your songs.

## Notes for MVP

* Data we want to record
  * [ ] Track metadata (artist, song title, bpm)
  * [ ] Position in track for each song
  * [ ] Position in master track
  * [ ] Volume for each song
  * [ ] Tempo for each track

* Console
  * [X] List of tracks
  * [ ] Pull list from backend
  * [ ] Highlight a song
    * [X] Show current time
    * [X] Show cue points
    * [X] Set cue points
    * [X] play and pause track
    * [ ] Adjust volume
    * [ ] Start and end loops
    * [ ] Adjust tempo
  * Unhighlited songs
    * [X] Current position in song
    * [X] length of song
    * [ ] history of position in song (horizontal lines)
  
* Mixboard
  * [ ] List of tracks
  * Each track
    * [ ] History of position using blocks
    * [ ] History of volume of track
    * [ ] History of tempo of track
  * Master progress bar

## Resources

  * <http://mxb.fm/>
  * <http://sf.musichackday.org/2012/>
  * <http://wiki.musichackday.org/index.php?title=SF_Music_Hack_Day_2012>
  * <http://www.padrinorb.com/guides>
  
### Getting Flash to work
  
  You might not have to do this, but...

  * Turn flashblock off, noob.
  * Add mixboard folder to http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html
  * In mixboard-app change `soundManager.url = '/path/to/sm2-flash-movies/'; // directory where SM2 .SWFs live`
  * if this doesn't fix it, you need to run on http://localhost

## Pitches

  * EchoNest - Rich Music Data API
    * Artist API
    * Song API (Beats, pitch)
    * Song identification
    * <http://developer.echonest.com>
  * LyricFind - $750 for best use of API
  * Seatwave 
    * Ticket sales
    * <http://developer.seatwave.com>
  * 3Scale (3 apis)
  * Soundcloud - Will fly you to next music hack day
  * Sonos/EMI 
    * <http://musicpartners.sonos.com> u/p: MusicHack/Hacker123
