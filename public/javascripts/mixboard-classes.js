/* bookmark class */
function Mark(position) {
  this.position = position;
}


/*  Sound
    This is an object that plays sound.
*/
function Sound(song_id) {
  this.data = SOUND_DATA[song_id][0]; // defined this on main.html (pull from db?)
  this.duration = 0;
  this.ready = false;
  this.mark_count = 0;
  this.marks = [];
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
Sound.prototype.stop = function() {
  this.manager.stop();
}
Sound.prototype.scrub = function(percentage) {
  this.manager.setPosition(percentage * this.manager.duration);
}




/*	Octopus
		This controls all songs.
*/
function Octopus() {
  // The tracks in the console.
	// use it as an array keyed with song_id.
	this.songs = {};
	
	// this is the sound_id of the selected / highlighted song.
	this.selected = null;
}

/* add a sound to app */
Octopus.prototype.add = function(sound) {
	this.songs[sound.data.id] = sound;
	
	// add the fist mark by default
}

/* get a sound object from an id */
Octopus.prototype.get = function(sound_id) {
	return this.songs[sound_id];
}

/* Play the mixboard */
Octopus.prototype.play = function(sound_id) {
  $.each(this.songs, function() {
    this.play();
  });
}

/* Pause the mixboard */
Octopus.prototype.pause = function(sound_id) {
  $.each(this.songs, function() {
    this.pause();
  });
}

/* plays or pauses either a specific song or all songs. returns the play state (pause/play) as a boolean (0/1) */
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

  song.marks.push(new Mark(position));
  song.marks.sort(sortMarks);
  song.mark_count++;

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
