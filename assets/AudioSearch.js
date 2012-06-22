function AudioSearch() {
	var lasturl = 'http://ws.audioscrobbler.com/2.0/?api_key=b25b959554ed76058ac220b7b2e0a026&';
	var lyrics = {titlebar: ''}
	var sources = [];
	var remixes = {html: '', wnd: null, title:'', titlebar: '', el: null, offset: 0, id: 0, found: [], original:[]}
	var list = {}
	
	this.openSetup = function() {
		switch(aSrcType) {
			case '6': $('.audio .setup.vk').slideToggle('fast');	break;
		}
	}
	
	this.liveSearch = function() {
		var q = $.trim($('.audio .query').val());
		if (q == '') {
			$('.audio .search .live').html('').hide();
			return;
		}
		$('.progress').show();
		q = encURI(q);
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, audio.onLiveSearch);
		loader.addEventListener(air.IOErrorEvent.IO_ERROR, cancelLoad);
		loader.load(new air.URLRequest(lasturl+'format=json&method=artist.search&limit=6&artist='+q));
	}
	
	this.onLiveSearch = function(e) {
		$('.progress').hide();
		var data = $.parseJSON(cleanU(e.target.data));
		if (typeof(data.results) == 'undefined') {
			$('.audio .search .live').html('').hide();
			return false;
		}
		var html = '';
		var img = '';
		$(data.results.artistmatches.artist).each(function(){
			var name = short(this.name, 40);
			html += '<div data-query="'+encURI(this.name)+'">' + name + '</div>';
		});
		closeCats();
		if (html != '')
			$('.audio .search .live').html(html).slideDown('fast');
		else
			$('.audio .search .live').html('').hide();	
	}
	
	this.liveSearchSelect = function(e) {
		var q = decURI($(this).attr('data-query'));
		$('.audio .search .query').val(q);
		closeMenus();
		$('.audio .search .query').focus();
	}	
	
	this.selectCat = function(e) {
		$('.audio .categories').hide();
		aSrcType = $(this).attr('data-type');
		$('.audio .search .cur-cat').text($(this).text());
		if (aSrcType == '6') {
			//$('.audio .searchbox .btn-setup').show();
			$('.audio .search .query').attr('placeholder','artist or track name')
		} else {
			//$('.audio .searchbox .btn-setup').hide();
			$('.audio .search .query').attr('placeholder','artist name')
		}
			
	}
	

	this.download = function(t){
		if (t.attr('data-url') == undefined) {
			$('.progress').show();
			getDl.push(t);
			var loader = new air.URLLoader();
			loader.addEventListener(air.Event.COMPLETE, audio.onFindDownload);
			var q = cleanName(t.attr('data-artist')) + " " + t.attr('data-title');
			sendRequest({method: 'audio.search', q: q, sort: 0, count: 200, offset: 0}, loader);
		} else {
			t.addClass('queue');
			var artist = t.find('.track b').text();
			var title = t.find('.track .title').text();
			var id = t.attr('data-id');
			var dl = {id: id, t:t, status: 'waiting', url: t.attr('data-url'), name: artist +' - '+ title +'.mp3'}
			queue.push(dl);
			processQueue();	
		}
	};
	
	this.playFile = function(e){
		if ($(e.target).is('img')) return;
		$('.row').removeClass('active')
		$(this).addClass('active');
		var artist = $(this).find('.track b').text();
		var title = $(this).find('.title').text();
		if (parseInt(artist.length) + parseInt(title.length) > 46) var marq = 'long'; else var marq = ''; 
		$('.audio .play-info').html('<div class="track '+marq+'"><b>'+cap(artist)+'</b> - '+cap(title)+'</div>');
		$("#jquery_jplayer").jPlayer("setFile", $(this).attr('data-url')).jPlayer("play");
	};
	

	
	this.getFiles = function(e) {
		$('.progress').show();
		$('.row').removeClass('active');
		playlist.getBody().find('.active').removeClass('active');
		$(this).addClass('active');
		if ($(this).attr('data-url') !== undefined) {
			var a = $(this).find('.track b').text();
			var t = $(this).find('.title').text();
			if (parseInt(a.length) + parseInt(t.length) > 44) var marq = 'long'; else var marq = ''; 
			$('.audio .play-info').html('<div class="track '+marq+'"><b>'+cap(a)+'</b> - '+cap(t)+'</div>');
			$("#jquery_jplayer").jPlayer("setFile", $(this).attr('data-url')).jPlayer("play");
			$('.progress').hide();
		} else {
			list.artist = $(this).attr('data-artist');
			list.title = $(this).attr('data-title').replace(/(\(|\))/g,'');
			list.track = cleanTitle($(this).attr('data-title'));
			list.id = $(this).attr('data-id');
			var q = list.artist + ' ' + list.title;
			var loader = new air.URLLoader();
			loader.addEventListener(air.Event.COMPLETE, audio.onGetFiles);
			sendRequest({method: 'audio.search', q: q, sort: 0, count: 200, offset: 0}, loader);
		}
	}
	
	this.onGetFiles = function(e) {
		$('.progress').hide();
		var src = audio.getFileSource(e, list);
		if (src === false) return;
		if (src.found === true) {
			d = src.d;
			var rmx = /\(.*\)/.exec(d.title);
			if (nsp(d.artist).indexOf(nsp(list.artist)) == -1 && lc(d.artist) != 'неизвестен') {
				var art = cleanName(d.artist) || list.artist;
			} else
				var art = list.artist;
			var title = cap(list.track) + (rmx != null ? ' ('+cap(cleanName(rmx[0]))+')' : '');
			if (parseInt(art.length) + parseInt(title.length) > 62) var marq = 'long'; else var marq = ''; 
			$('.audio .results .active').attr('data-url',d.url).attr('data-offset','0').attr('data-remixes',d.count).html("<div class='track "+marq+"'><b>"+art+"</b> - <span class='title'>"+title+"</span></div><div class='info'>"+mkTime(d.duration)+"</div>");
			$("#jquery_jplayer").jPlayer("setFile", d.url).jPlayer("play");
			if (parseInt(art.length) + parseInt(title.length) > 44) var marq = 'long'; else var marq = ''; 
			$('.audio .play-info').html('<div class="track '+marq+'"><b>'+art+'</b> - '+title+'</div>');
			$('.progress').hide();
		} else
			$(".row.active").removeClass('active').next().click().end().remove();
	}
	
	this.onFindDownload = function(e) {
		$('.progress').hide();
		var t = getDl.shift();
		var src = audio.getFileSource(e, {artist: t.attr('data-artist'), track: t.attr('data-title'), id: t.attr('data-id')});
		if (src === false) return;
		if (src.found === true) {
			t.attr('data-url',src.d.url).attr('data-offset','0').append("<div class='info'>"+mkTime(src.d.duration)+"</div>");
			audio.download(t);
		}
	}
	
	this.getFileSource = function(e, cmp) {
		var data = $.parseJSON(cleanU(e.target.data));
		var ret = {};
		if (typeof(data.response) == 'undefined') return false;
		sources[cmp.id] = [];
		ret.found = false;
		var i = 0;
		var total = data.response[0];
		var sort = new Array();
		var count = 0;
		for (key in data.response) {
			var d = data.response[key];
			if (typeof(d.duration) == 'undefined') continue;
			if (sort[d.duration] == null) {
				sort[d.duration] = 1;
				count++;
			}
			else sort[d.duration]++; 
		}
		var res = arsort(sort, 'SORT_NUMERIC'); // sorted by occurencies desc     array[duration] = occur;
		var vals = array_values(res); // array values (occurencies)
		var keys = array_keys(res); // array keys (duration)
		var dur = keys[0];
		
		if (vals[0] == 1) {	// if  1 occurence is max, take the longest (ok) 
			res = krsort(sort, 'SORT_NUMERIC');
			dur = array_keys(res)[0];
		} 
		else {
			if (Math.abs(vals[0] - vals[1]) < 3) // if occurs difference < 3 take the longest of these 2
				dur = Math.max(keys[0], keys[1]);	
		}
		for (key in data.response) {
			i++;
			var d = data.response[key];
			d.count = count;
			if (typeof(d.title) == 'undefined') continue
			if (d.duration != dur) continue;	
										
			var words = cmp.track.split(' '), wrong = 0;
			for(k in words) {
				if (words[k].length < 2) continue;
				if (lc(d.title).indexOf(lc(words[k])) == -1) wrong++;
			}
			if (wrong/words.length > 0.5) continue;
			sources[cmp.id].push(d);			
		}
		if (sources[cmp.id].length > 0) {
			ret.d = sources[cmp.id][0];
			ret.found = true;
		}
		return ret;
	}
		
	this.changeSource = function(t) {
		if (t.attr('data-url') == undefined || typeof(sources) == 'undefined') return;
		var id = t.attr('data-id');
		if (sources[id] == undefined) return;
		var off = t.attr('data-offset') || 0;
		if (sources[id].length > off+1) off++; else off = 0; 
		t.attr('data-offset',off);
		var d = sources[id][off];	
		t.attr('data-url',d.url);
		t.find('.track').html('<b>'+d.artist+'</b> - <span class="title">'+d.title+'</span>');
		t.find('.info').html(mkTime(d.duration));
		if (t.hasClass('active')) t.click();	
	}
	
	this.getRemixes = function(t) {
		$('.progress').show();
		remixes.html = '';
		remixes.offset = 0;
		remixes.id = t.attr('data-id');
		remixes.el = t;
		remixes.found.splice(0,remixes.found.length);
		remixes.original.splice(0,remixes.original.length);
		remixes.title = t.attr('data-original') || t.attr('data-title').replace(/\(.*\)/g,'');
		remixes.titlebar = t.attr('data-artist') + ' ' + remixes.title;
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, audio.onGetRemixes); 
		sendRequest({method: 'audio.search', q: remixes.titlebar, sort: 0, count: 200, offset: 0}, loader);	
	}
	
	this.onGetRemixes = function(e) {
		remixes.offset+= 200;
		var cur = remixes.el;
		var data = $.parseJSON(cleanU(e.target.data));
		if (data.response == undefined) {
			audio.openRemixes();
			return;
		}
		var artist = cur.attr('data-artist');
		var title = remixes.title;
		var q = artist + ' '+ title;
		if (data.response[0] > 600) var limit = 600;
		else var limit = data.response[0];
		for(key in data.response) {
			var d = data.response[key];
			if (d.title == undefined) continue;
			if (d.duration < 120) continue;
			if (d.duration > 900) continue;
			if (!in_string(d.title, title)) continue;
			var dur = mkTime(d.duration);
			var rmx = /( mix|rmx| remix)/i.exec(d.title);
			if (rmx == null) {
				if (remixes.found.length > 9 || remixes.original.length > 9) continue; // if 10 remixes found, dont bother with other 
				var txt = trim(cleanName(d.title));
				if (txt == '') continue;
				if (!roArray(d.duration, remixes.original)) { // if duration still not met, add to originals array
					txt = cap(short(txt,45));
					var html = '<div class="rmx" data-duration="'+dur+'" data-id="'+remixes.id+'" data-title="'+remixes.title+'" data-url="'+d.url+'"><div class="text">'+cap(txt)+'</div><div class="info">'+dur+'</div></div>';
					remixes.original.push({dur: d.duration, txt:txt, html: html});
				}	
			} else {
				var r = /\((.|\s)*(remix|mix|rmx).*/gi.exec(d.title);
				var txt = '';
				if (r == null) {
					var c = new RegExp(title,'gi');
					txt = trim(txt.replace(c,''));
				} else
					txt = cleanRemix(r[0]);					 
				if (txt == '') continue;
				var html = '<div class="rmx" data-duration="'+dur+'" data-title="'+title+'" data-id="'+remixes.id+'" data-url="'+d.url+'"><div class="title">'+cap(txt)+'</div><div class="info">'+dur+'</div></div>';
				if (!rmArray(d.duration, remixes.found))	{ // if duration not met, add to list
					txt = cap(short(txt,45));
					remixes.found.push({dur: d.duration, txt:txt, html: html});
				}			
			}
		}
		
		if (remixes.offset < limit) {
			var loader = new air.URLLoader();
			loader.addEventListener(air.Event.COMPLETE, audio.onGetRemixes);
			sendRequest({method: 'audio.search', q: q, sort: 0, count: 200, offset: remixes.offset}, loader);	
		} else audio.openRemixes();
			
	}
	
	this.openRemixes = function() {
		$('.progress').hide();
		remixes.found.sort(sortDur);	// sort arrays by duration
		remixes.original.sort(sortDur);
		
		if (remixes.found.length > 0) {
			remixes.html += '<div class="sep">Remixes</div>';
			for(var k in remixes.found) {
				if (nsp(remixes.html).indexOf(nsp(remixes.found[k].txt)) == -1)
				remixes.html+= remixes.found[k].html;
			}	
		}
		
		if (remixes.original.length > 0) {
			remixes.html += '<div class="sep">Other</div>';
			for(var k in remixes.original)
				if (nsp(remixes.html).indexOf(nsp(remixes.original[k].txt)) == -1)
					remixes.html += remixes.original[k].html;
		}
		
		if (remixes.html == '') return;

		if (remixes.wnd != null) {
			remixes.wnd.window.nativeWindow.title = cap(remixes.titlebar);
			var body = $(remixes.wnd.window.document.body);	
			body.find('.remixes').html(remixes.html);
			remixes.wnd.window.nativeWindow.activate();
			return;
		}
		var wndOpts = new air.NativeWindowInitOptions();
		var path = air.File.applicationDirectory.resolvePath('remixes.html');
		wndOpts.type = air.NativeWindowType.UTILITY;
		wndOpts.resizable = true;
		remixes.wnd = air.HTMLLoader.createRootWindow(false, wndOpts, true);
		var nWnd = remixes.wnd.window.nativeWindow;
		remixes.wnd.addEventListener(air.Event.COMPLETE, audio.onOpenRemixes);
		nWnd.addEventListener(air.Event.CLOSING, function(){
			remixes.wnd = null;
		});
		nWnd.width = 310;
		nWnd.height = 400;
		nWnd.maxSize = new air.Point(310,760);
		nWnd.minSize = new air.Point(310,400)
		nWnd.title = cap(remixes.titlebar);
		remixes.wnd.load(new air.URLRequest(path.url));
	}
	
	this.onOpenRemixes = function(e) {
		remixes.wnd.removeEventListener(air.Event.COMPLETE, audio.onOpenRemixes);
		var body = $(remixes.wnd.window.document.body);
		body.find('.remixes > div').live('click', audio.loadRemix);	
		body.find('.remixes').html(remixes.html);
		remixes.wnd.window.nativeWindow.activate();
	}
	
	this.loadRemix = function(e) {
		var t = $(e.currentTarget);
		var el = t.attr('data-id');
		var url = t.attr('data-url');
		var dur = t.attr('data-duration');
		var txt = t.find('.title').text() || t.find('.text').text();
		if (txt != "") txt = '('+txt+')';
		var title = cap(t.attr('data-title')) +' '+txt;	
		var row = $('.audio .results .row[data-id="'+el+'"]');
		if (parseInt(title.length) > 62) row.find('.track').addClass('long'); else row.find('.track').removeClass('long');
		row.attr('data-url',url).find('.title').html(title);
		row.find('.info').html(dur);
	}
	
	this.getLyrics = function(t) {
		$('.progress').show();
		var artist = cap(t.find('.track b').text());
		var song = cap(t.find('.title').text()); 
		var loader = new air.URLLoader();
		lyrics.titlebar = artist + ' - ' + song;
		loader.addEventListener(air.Event.COMPLETE, audio.onGetLyrics);
		loader.addEventListener(air.IOErrorEvent.IO_ERROR, cancelLoad);
		loader.load(new air.URLRequest('http://lyrics.wikia.com/'+artist+':'+song));
		
	}
	
	this.onGetLyrics = function(e) {
		$('.progress').hide();
		var d = e.target.data;
		var lyr = $('.lyricbox',$(d));
		lyr.find('.rtMatcher').remove();
		var wndOpts = new air.NativeWindowInitOptions();
		wndOpts.type = air.NativeWindowType.UTILITY;
		wndOpts.resizable = true;
		instance = air.HTMLLoader.createRootWindow(false, wndOpts, true);
		instance.window.nativeWindow.width = 320;
		instance.window.nativeWindow.height = 510;
		instance.window.nativeWindow.title = lyrics.titlebar;
		var css = '<style>* {font-size: 12px; padding: 3px;}</style>';
		instance.loadString(css+lyr.html());
		instance.window.nativeWindow.activate();
	}
	
			
}
var audio = new AudioSearch();




