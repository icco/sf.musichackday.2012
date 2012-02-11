/* bookmark class */
function Mark(position, sound_id) {
  this.position = position;
  this.sound_id = sound_id;
  ++octopus.get(sound_id).mark_count;
}


/*  Sound
    This is an object that plays sound.
*/
function Sound(song_id) {
  this.data = SOUND_DATA[song_id][0]; // defined this on main.html (pull from db?)
  this.duration = 0;
  this.ready = false;
  this.mark_count = 0;
  this.manager = soundManager.createSound({
    id: this.data.id,
    url: this.data.url
  });


  var self = this;
  this.manager.load({
    onload: function() {
      self.duration = self.manager.duration;
      self.ready = 3 == self.manager.readyState;
      self.manager.position = 0;
      UI.update_soundList();
    }
  });
}
Sound.prototype.play = function() {
  this.manager.play();
}
Sound.prototype.pause = function() {
  this.manager.pause();
}
Sound.prototype.scrub = function(percentage) {
  this.manager.setPosition(percentage * this.manager.duration);
}




/*	Octopus
		This controls all songs.
		This has all songs and the mixboard.
*/
function Octopus() {
	// object -- use it as an array, key it with song_id.
	this.songs = {};

	// array of something
	// TODO: what?
 	this.marks = [];

	// array of song ids that are in the mixboard
	this.mixboard = [];
}

/* add a sound to app */
Octopus.prototype.add = function(sound) {
	this.songs[sound.data.id] = sound;
}

/* get a sound object from an id */
Octopus.prototype.get = function(sound_id) {
	return this.songs[sound_id];
}
/* adds a song to the mixboard */
Octopus.prototype.use = function(sound_id) {
	this.mixboard.push(sound);
}
/* deprecated in favor of .toggle */
/* takes a sound id. if one is given, plays that sound.
if no sound id is given, it plays all sounds. */
Octopus.prototype.play = function(sound_id) {
  // TODO: play the main mixboard
}
/* deprecated in favor of .toggle */
Octopus.prototype.pause = function(sound_id) {
  // TODO: pause the main mixboard
}
/* plays or pauses. returns the play state (pause/play) as a boolean (0/1) */
Octopus.prototype.toggle = function(sound_id) {
	var play_state = 0;
	$.each(this.songs, function() {
    if(!sound_id || this.data.id==sound_id) {
      if(!this.manager.playState || this.manager.paused) {
		    this.play();
			} else {
				this.pause();
			}
			play_state = !this.manager.paused;
    }
  });
	return play_state;
}

// adds the bookmark to the metadata. returns the percentage played at this mark
Octopus.prototype.mark = function(sound_id) {
  var song = this.songs[sound_id];
  var position = song.manager.position;
  this.marks.push(new Mark(position, sound_id));
  this.marks.sort(sortMarks);
  return position/song.manager.duration;
}
function sortMarks(a, b) {
  if(a.position < b.position) {
    return -1;
  } else if(a.position > b.position) {
    return 1;
  } else {
    return 0;
  }
}