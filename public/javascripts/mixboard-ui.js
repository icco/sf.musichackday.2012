/* VIEW */
var UI = {};
UI.bind = function() {
    $('#octopus-play').click(function() {
        octopus.play();
    });
    $('#octopus-pause').click(function() {
        octopus.pause();
    });

    $('.sound .button.play').live('click', function() {
		// change button text when toggling play/pause
		playing = octopus.toggle($(this).parent().attr('id'));
		if(playing) {
				$(this).html('Pause');
		} else {
				$(this).html('Play');
		}
		UI.update();
    });
    $('.sound .button.mark').live('click', function() {
        var percentage = octopus.mark($(this).parent().attr('id'));
        UI.mark($(this).parent().attr('id'), percentage);
    });
    $('.sound .button.use').live('click', function() {

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
            if(scrub_bar_drag) {
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
    setTimeout('UI.mainLoop()', 250);
}
// update teh whole UI
UI.update = function() {
	//if(DEBUG) Knowledge.time_start();

    UI.update_soundList();
    UI.update_mainlist();

	//if(DEBUG) Knowledge.time_end();
	//if(DEBUG) Knowledge.time_print();
}
// redraw the list of sounds
UI.update_soundList = function() {
    var max_length = max_duration(octopus.songs);
    var width = $('#canvas').width();

    $.each(octopus.songs, function() {
        // in here, THIS refers to the Song object.

        var div;

        // add the div to the page, if it isn't already there
        if(!$('#soundlist').has('#'+this.data.id).length) {
            div = UI.div_sound(this);
            $('#soundlist').append(div);
        } else {
            div = $('#'+this.data.id);
        }

		// set the sound length
		// this is done every iteration because it is 0 when loading
		div.find('.timestamp').html(UI.time_format(this.duration));

        // div's width is calculated via song length
        var new_width = width * (this.duration/max_length);
        new_width -= 2 * parseInt(div.css('padding-left'));
        div.css('width', new_width);

        // moving position bar
        var scrub_bar;
        if(!div.has('.scrub-bar').length) {
            scrub_bar = UI.div_scrub_bar();
			timestamp = UI.DIV_GENERIC('scrub_timestamp');

			scrub_bar.append(timestamp);
            div.append(scrub_bar);
        } else {
            scrub_bar = div.find('.scrub-bar');
        }
        if(this.manager.position) {
            var left_offset = div.outerWidth() * this.manager.position/this.duration;
            scrub_bar.css('left', left_offset);
			scrub_bar.find('.scrub_timestamp').html(UI.time_format(this.manager.position));
        }
    });
}

UI.update_mainlist = function() {

}

UI.mark = function(sound_id, percentage) {
    // add the scrub bar
    var scrub_mark = UI.div_scrub_mark();
    var left_offset = percentage * $('#'+sound_id).outerWidth();
    scrub_mark.css('left', left_offset);

    // text in scrub bar
    var span = UI.span();
    span.html(UI.mark_id_to_letter(octopus.get(sound_id).mark_count));
    span.attr('class', 'scrub-mark-text');
    scrub_mark.append(span);

    $('#'+sound_id).append(scrub_mark);


}

UI.span = function() {
    return $(document.createElement('span'));
}

UI.button = function(title, class_thing) {
    var a = $(document.createElement('a'));
    a.attr('class', 'button '+class_thing);
    a.attr('href', "#");
    a.html(title);
    return a;
}

UI.div_sound = function(sound) {
  var div = $(document.createElement('div'));
  div.attr('id', sound.data.id);
  div.attr('class', 'sound');

	var timestamp = UI.time_format(sound.manager.duration);
	div.append(UI.DIV_GENERIC('timestamp alpha-2').html(timestamp));

  div.append(UI.button('Play', 'play left'));
  div.append(UI.button('Mark', 'mark right'));
	div.append(UI.button('Use', 'use'));
  div.append(sound.data.name);
  return div;
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

UI.mark_id_to_letter = function(int) {
    return String.fromCharCode(64+int);
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

	if(seconds < 10) seconds = "0" + seconds;
	if(minutes < 10) minutes = "0" + minutes;

 	string = minutes + ":" + seconds;// + ":" + deca;
	if(hours > 0) string = hours + ":" + string;

	return string;
}

/* random helper functions */

function max_duration(arr) {
    var max = 0;
    $.each(arr, function() {
        if(this.duration > max) {
            max = this.duration;
        }
    });
    return max;
}