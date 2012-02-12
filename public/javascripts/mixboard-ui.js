/* VIEW */
var UI = {};

/* Instance vars */
// song_id of the song currently selected / highlighted on the UI
UI.selected_song_id = null;

// Assembles the UI, binds events
UI.bind = function() {
  // Main mixboard play/pause buttons
  $('#mixboard').append(UI.button('Play', null).attr('id', 'octopus-play'));
  $('#mixboard').append(UI.button('Pause', null).attr('id', 'octopus-pause'));

  // Main mixboard play
  $(document).on('click', '#octopus-play', function() {
    octopus.play();
  });

  // Main mixboard pause
  $(document).on('click', '#octopus-pause', function() {
    octopus.pause();
  });

  // Individual sound play / pause
  $(document).on('click', '.sound .button.play', function() {
		// change button text when toggling play/pause
		playing = octopus.toggle($(this).parent().attr('id'));

    if (playing) {
      $(this).html('Pause');
    } else {
      $(this).html('Play');
    }

		UI.update();
  });

  $(document).on('click', '.sound .button.mark', function(click_event) {
    var percentage = octopus.mark($(this).parent().attr('id'));
    UI.mark($(this).parent().attr('id'), percentage);
  });

  // bind number keys to markers
  $(document).on('keypress', function(key_event) {
    var ANSI_OFFSET = 48;
    var key = key_event.keyCode - ANSI_OFFSET;

    if (key >= 1 && key <= 9) {
      octopus.cue(UI.selected_song_id, key);
    }
  });

  // dragging the scrub bar
  {
    var scrub_bar_drag = false;
    var scrub_bar_startX = 0;
    var scrub_bar_startY = 0;
    var scrub_bar_start_offset = 0;
    var scrub_bar_pid = 0;

    $('.scrub-bar').live('mousedown', function(mouse) {
      scrub_bar_startX = mouse.pageX;
      scrub_bar_startY = mouse.pageY;
      scrub_bar_start_offset = parseInt($(this).css('left'));
      scrub_bar_drag = true;
      scrub_bar_pid = $(this).parent().attr('id');
    });

    $('body').mousemove(function(mouse) {
      if (scrub_bar_drag) {
        var deltaX = mouse.pageX - scrub_bar_startX;
        var deltaY = mouse.pageY - scrub_bar_startY;

        var new_left_offset = scrub_bar_start_offset+parseInt(deltaX);
        $('#'+scrub_bar_pid+' .scrub-bar').css('left', new_left_offset);
        var scrub_percentage = new_left_offset / $('#'+scrub_bar_pid).outerWidth();
        octopus.get(scrub_bar_pid).scrub(scrub_percentage);
      }
    });

    $('body').mouseup(function() {
        scrub_bar_drag = false;
    });
  }
}

// updates the site UI every 1/4 second
UI.mainLoop = function() {
  UI.update();
  setTimeout('UI.mainLoop()', 50);
}

// update teh whole UI
UI.update = function() {
	//if (DEBUG) Knowledge.time_start();

  UI.update_soundList();
  UI.update_mixboard();

	//if (DEBUG) Knowledge.time_end();
	//if (DEBUG) Knowledge.time_print();
}

// redraw the list of sounds
// NOTE: Called a ton, be careful what you put in here.
UI.update_soundList = function() {
  var max_length = max_duration(octopus.songs);
  var width = $('#soundlist').width();

  // Select hovered song.
  UI.mark_selected($('.sound:hover'));

  $.each(octopus.songs, function(i) {
    // in here, 'this' refers to the Song object.
    var div;

    // add the div to the page, if it isn't already there
    if (!$('#soundlist:has(#'+this.data.id+')').length) {
      div = UI.div_sound(this);
      $('#soundlist').append(div);

      // Default to selecting the first song
      // Probably end up removing this later
      if (UI.selected_song_id == null) {
        UI.selected_song_id = this.data.id;
      }
    } else {
      div = $('#soundlist #'+this.data.id);
    }

  	// set the sound length
  	// this is done every iteration because it is 0 when loading
  	div.find('.timestamp').html(UI.time_format(this.duration));

    // div's width is calculated via song length
    var new_width = width * (this.duration/max_length);
    new_width -= 2 * parseInt(div.css('padding-left'));
    div.css('width', new_width);

    // create the moving position bar
    var scrub_bar;
    if (!div.has('.scrub-bar').length) {
      scrub_bar = UI.div_scrub_bar();
		  timestamp = UI.DIV_GENERIC('scrub_timestamp');

		  scrub_bar.append(timestamp);
      div.append(scrub_bar);
    } else {
      scrub_bar = div.find('.scrub-bar');
    }
    
    // place the moving position bar
    if (this.manager.position) {
      var left_offset = div.outerWidth() * this.manager.position/this.duration;
      scrub_bar.css('left', left_offset);
      scrub_bar.find('.scrub_timestamp').html(UI.time_format(this.manager.position));
    }
    
    // draw the marks
    if(this.marks.length != $('#soundlist #'+this.data.id+' .scrub-mark').length) {
      // remove all the marks
      $('#soundlist #'+this.data.id+' .scrub-mark').each(function() {
        $(this).remove();
      });

      // draw all the marks
      var sound_id = this.data.id;
      var duration = this.manager.duration;
      $.each(this.marks, function() {
        var percentage = this.position/duration;
        UI.mark(sound_id, percentage, this.name);
      });
    }
  });
}

UI.update_mixboard = function() {
  var max_length = max_duration(octopus.songs);
  var width = $('#mixboard').width();

  $.each(octopus.songs, function() {
    // in here, THIS refers to the Song object.
    var div;

    // add the div to the page, if it isn't already there
    if (!$('#mixboard:has(#'+this.data.id+')').length) {
      div = UI.div_mixboard_sound(this);
      $('#mixboard').append(div);
    } else {
      div = $('#mixboard #'+this.data.id);
    }

/*
    // div's width is calculated via song length
    var new_width = width * (this.duration/max_length);
    new_width -= 2 * parseInt(div.css('padding-left'));
    div.css('width', new_width);
*/
  });
}

UI.mark = function(sound_id, percentage, name) {
  // add the position bar
  var scrub_mark = UI.div_scrub_mark();
  var left_offset = percentage * $('#soundlist #'+sound_id).outerWidth();
  scrub_mark.css('left', left_offset);

  // text in scrub bar
  var span = UI.span();
  if(name == null) {
    span.html(octopus.get(sound_id).marks.last().name);
  } else {
    span.html(name);
  }
  
  span.attr('class', 'scrub-mark-text');
  scrub_mark.append(span);

  $('#soundlist #'+sound_id).append(scrub_mark);
}


/********************/
/*** DOM ELEMENTS ***/
/********************/

/* Specific */

// One sound in the track list
UI.div_sound = function(sound) {
  var div = $(document.createElement('div'));
  div.attr('id', sound.data.id);
  div.attr('class', 'sound');

	var timestamp = UI.time_format(sound.manager.duration);
	div.append(UI.DIV_GENERIC('timestamp alpha-2').html(timestamp));

  div.append(UI.button('Play', 'play left'));
  div.append(UI.button('Mark', 'mark right'));
  div.append(sound.data.name);
  return div;
}

// One sound in the mixboard view
UI.div_mixboard_sound = function(sound) {
  var div = $(document.createElement('div'));
  div.attr('id', sound.data.id);
  div.attr('class', 'mixboard-sound');

  div.append(sound.data.name);

  return div;
}


/* Generic */

UI.span = function() {
  return $(document.createElement('span'));
}

UI.button = function(title, button_class) {
  var a = $(document.createElement('a'));
  a.attr('class', 'button '+button_class);
  a.attr('href', "#");
  a.html(title);
  return a;
}

UI.div_scrub_bar = function() {
  var div = $(document.createElement('div'));
  div.attr('class', 'scrub-bar');
  return div;
}

UI.div_scrub_mark = function() {
  var div = $(document.createElement('div'));
  div.attr('class', 'scrub-mark');
  return div;
}

UI.DIV_GENERIC = function(div_class) {
  var div = $(document.createElement('div'));
  div.attr('class', div_class);
  return div;
}

UI.mark_id_to_letter = function(integer) {
  //return String.fromCharCode(64+integer);
  return integer;
}

UI.mark_selected = function(div) {
  $('#soundlist').children().each(function() {
    $(this).removeClass('selected');
  });

  div.addClass('selected');

  UI.selected_song_id = div.attr('id');
}

/* takes milliseconds, returns a nice pretty string */
UI.time_format = function(ms) {
	var x = ms / 1000;
	//var deca = Math.round(x % 60);
	//x /= 60;
	var seconds = Math.round(x % 60);
	x /= 60;
	var minutes = Math.round(x % 60);
	x /= 60;
	var hours = Math.round(x % 24);

	if (seconds < 10) seconds = "0" + seconds;
	if (minutes < 10) minutes = "0" + minutes;

 	string = minutes + ":" + seconds;// + ":" + deca;
	if (hours > 0) string = hours + ":" + string;

	return string;
}


/* random helper functions */

function max_duration(arr) {
  var max = 0;

  $.each(arr, function() {
    if (this.duration > max) {
      max = this.duration;
    }
  });

  return max;
}
