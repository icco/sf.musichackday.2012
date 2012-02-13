/* bookmark class */
// This is a 'cue' on a song.
// position is the song time in miliseconds where the mark is added.
// name is the name of this mark displayed on the ui, and used for jumping directly to the mark.
function Mark(position, name) {
  this.position = position;
  this.name = name;
}

/*
 *  Sound
 *  This is an object that plays sound.
 */
function Sound(song_id) {
  this.data = SOUND_DATA[song_id][0]; // defined this on main.html (pull from db?)
  this.duration = 0;
  this.ready = false;
  this.mark_count = 0;
  this.marks = {};

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

  this.play = function() {
    this.manager.play();
    history.add(this.data.id, { "status": "playing" });
  }

  this.pause = function() {
    this.manager.pause();
    history.add(this.data.id, { "status": "paused" });
  }

  this.stop = function() {
    this.manager.stop();
  }

  this.scrub = function(percentage) {
    var newPos = percentage * this.manager.duration;
    this.manager.setPosition(newPos);
    history.add(this.data.id, { "position": newPos });
  }

  // Cues the song at the position given by the mark named mark_name
  this.cue = function(mark_name) {
    var mark = this.marks[mark_name];
    if (mark && mark.position) {
      this.manager.setPosition(mark.position);
      history.add(this.data.id, { "position": mark.position });
    } else {
      this.mark(mark_name);
      if (DEBUG) console.log(mark_name + " is now defined.");
    }
  }

  // Adds a mark at song's current position
  // Returns the marked position in miliseconds
  this.mark = function(mark_name) {
    var position_ms = this.manager.position;

    if (mark_name) {
      this.marks[mark_name] = new Mark(position_ms, mark_name);
    } else {
      var next_name;
      for(next_name = 1; this.marks[next_name] != null; next_name++) { /* silence is golden */ }
      this.marks[next_name] = new Mark(position_ms, next_name);
    }

    //this.marks.sort(sortMarks);
    return position_ms;
  }
}

/*
 *	Octopus
 *	This controls all songs.
 */
function Octopus() {
  // The tracks in the console.
	// use it as an array keyed with song_id.
	this.songs = {};

	// this is the sound_id of the selected / highlighted song.
	this.selected = null;

  /* add a sound to app */
  this.add = function(sound) {
  	this.songs[sound.data.id] = sound;

  	// add the fist mark by default?
  }

  /* get a sound object from an id */
  this.get = function(sound_id) {
  	return this.songs[sound_id];
  }

  /* Play the mixboard */
  this.play = function(sound_id) {
    $.each(this.songs, function() {
      this.play();
    });
  }

  /* Pause the mixboard */
  this.pause = function(sound_id) {
    $.each(this.songs, function() {
      this.pause();
    });
  }

  // plays or pauses either a specific song or all songs. returns the play state (pause/play) as a boolean (0/1)
  this.toggle = function(sound_id) {
  	var play_state = 0;
  	$.each(this.songs, function() {
      if (!sound_id || this.data.id==sound_id) {
        if (!this.manager.playState || this.manager.paused) {
  		    this.play();
  			} else {
  				this.pause();
  			}
  			play_state = !this.manager.paused;
      }
    });

  	return play_state;
  }

  // Adds mark/cue to the Song.
  // Returns the percentage played at this mark.
  this.mark = function(sound_id) {
    var song = this.songs[sound_id];
    song.mark();
  }

  // Jumps the song specified by song_id to the mark name
  // If that mark name doesn't exist, it's created
  this.cue = function(song_id, mark_name) {
    this.songs[song_id].cue(mark_name);
  }

}

function sortMarks(a, b) {
  if (a.position < b.position) {
    return -1;
  } else if (a.position > b.position) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * History.
 */
function History() {
  this.data = {};
  this.time = 0;
  this.length = 600000; // ten minutes in miliseconds

  // Eventually this should be something like user/project.
  this.id = "mixboard";

  this.init = function() {
    if (DEBUG) console.log("History initialized.");
  };

  this.add = function(song_id, state) {
    var newState = { };
    newState[song_id] = state;

    //if (DEBUG) console.log(this.data);
    this.data[this.time] = $.extend(this.data[this.time], newState);

    this.save();
  }

  this.save = function() {
    localStorage[this.id] = JSON.stringify(this.data);
  }
}
