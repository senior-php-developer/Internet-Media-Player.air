function LastFm() {
	var artist = "", title = "", creator = "", query = '';
	var list = {artist: '', title: '', creator: '', query: '', id: 0}
	var id = 0, cur = 0, offset = 0;
	var loader = new air.URLLoader();
	var url = 'http://ws.audioscrobbler.com/2.0/?api_key=b25b959554ed76058ac220b7b2e0a026&';
	var found = [];
	var instance = null;

	this.getList = function(q) {
		list.id = 0;
		found.splice(0, found.length);
		$('.progress').show();
		if (q == '') return;
		list.artist = q;
		$('.audio .results').empty();
		q = cleanArgsLfm(trim(q));
		list.query = q;
		var loader = new air.URLLoader();
		loader.addEventListener(air.IOErrorEvent.IO_ERROR, last.getListAgain);
		if (settings.audio.tracks == 50) {
			loader.addEventListener(air.Event.COMPLETE, last.onGetList);
			loader.load(new air.URLRequest('http://ws.audioscrobbler.com/2.0/artist/'+q+'/toptracks.xspf'));	
		} else {
			loader.addEventListener(air.Event.COMPLETE, last.onGetList2);
			loader.load(new air.URLRequest('http://www.last.fm/music/'+q+'/+charts?rangetype=6month&subtype=tracks'));
		}		
	}
		
	this.getListAgain = function() {
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, last.onGetListAgain);
		loader.load(new air.URLRequest(url+'format=json&method=artist.search&limit=1&artist='+list.query));
	}
	
	this.onGetListAgain = function(e) {
		var data = $.parseJSON(cleanU(e.target.data));
		if (typeof(data.results.artistmatches.artist) == 'undefined') {
			$('.audio .results').html('<div class="bigtitle">Not Found</div>');
			return false;
		}
		var q = data.results.artistmatches.artist.name; 
		q = encURI(trim(q));
		var loader = new air.URLLoader();
		if (settings.audio.tracks == 50) {
			loader.addEventListener(air.Event.COMPLETE, last.onGetList);
			loader.load(new air.URLRequest('http://ws.audioscrobbler.com/2.0/artist/'+q+'/toptracks.xspf'));	
		} else {
			loader.addEventListener(air.Event.COMPLETE, last.onGetList2);
			loader.load(new air.URLRequest('http://www.last.fm/music/'+q+'/+charts?rangetype=6month&subtype=tracks'));
		}	
	}
	
		
	this.onGetList = function(e) {
		$('.progress').hide();
		var data = $.xml2json(cleanU(e.target.data));
		var check = rsArray(data.trackList.track[0].creator, recent.audio);
		if (check != -1) {
			recent.audio.splice(check,1);
			recent.audio.unshift('<div class="recent"><b>'+data.trackList.track[0].creator+'</b></div>');
		} else {
			recent.audio.unshift('<div class="recent"><b>'+data.trackList.track[0].creator+'</b></div>');
		}
		$(".audio .results").html('<div class="bigtitle">'+data.title+'</div>');
		$(data.trackList.track).each(function(){
			if (this.title == undefined || this.creator == undefined || this.title == '') return true;
			var artist = this.creator.replace(/\(.*\)/g,"");
			var title = cleanTitle(this.title.replace(/\-/g,' '));
			list.id++;	
			if (parseInt(artist.length) + parseInt(title.length) > 62) var marq = 'long'; else var marq = '';
			if (!in_array(title, found)) {
				$('.audio .results').append("<div class='row last' data-id='"+list.id+"' data-artist='"+artist+"' data-title='"+title+"'> <div class='track "+marq+"'><b>"+artist+"</b> - <span class='title'>"+title+"</span></div><div class='info'></div></div>");
				found.push(title);
			}
		});
	}
	
	this.onGetList2 = function(e) {
		$('.progress').hide();
		var data = $("#content", cleanU(e.target.data));
		var artist = trim($('.pagehead .breadcrumb a', data).eq(1).text());
		artist = cleanArtist(artist);
		var check = rsArray(artist, recent.audio);
		if (check != -1) {
			recent.audio.splice(check,1);
			recent.audio.unshift('<div class="recent"<b>'+artist+'</b></div>');
		} else {
			recent.audio.unshift('<div class="recent"><b>'+artist+'</b></div>');
		}
		$(".audio .results").html('<div class="bigtitle">'+artist+'</div>');
		var tracks = $('.modulechartstracks .chart6month tr td.subjectCell div', data).toArray();
		for (var i=0; i< tracks.length; i++){
				var t = tracks[i];
				if (list.id >= settings.audio.tracks || i > tracks.length || i > 200) break;
				var title = $(t).find('> a').text() || '';
				title = cleanTitle(title);	
				if (title == '' || title == undefined) continue;
				if (parseInt(artist.length) + parseInt(title.length) > 62) var marq = 'long'; else var marq = '';
				if (!in_array(title, found)) {
					list.id++;
					if (list.id % 50 == 0) var bb = 'fifty'; else var bb = '';
					$('.audio .results').append("<div class='row last "+bb+"' data-id='"+list.id+"' data-artist='"+artist+"' data-original='"+title+"' data-title='"+title+"'> <div class='track "+marq+"'><b>"+artist+"</b> - <span class='title'>"+cap(title)+"</span></div><div class='info'></div></div>");
					found.push(title);
				}
			}		
			$('.progress').hide();

	}

	
	this.getSimilar = function(q) {
		id = 0;
		$('.progress').show();
		if (q == '') return;
		list.artist = cap(q);
		q = cleanArgsLfm(trim(q));
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, last.onGetSimilar);
		loader.load(new air.URLRequest('http://ws.audioscrobbler.com/2.0/artist/'+q+'/similar.xml'));	
	}
		
	this.onGetSimilar = function(e) {
		var result = $.xml2json(cleanU(e.target.data));
		var res = '';
		$(result.artist).each(function(){
			if (typeof(this.image) == 'undefined') return;
			id++;	
			if (typeof(this.image[0].size) == 'undefined') {
				var img =  this.image.replace(/\/34/,'/252');
			} else img = '';
			if (img == '') img = 'assets/img/musicalnote.png';
			var html = "<div class='el similar' data-id='"+id+"'><div class='image horz' style='background: url(\""+img+"\") no-repeat center center'><div class='name'>"+this.name+"</div></div></div>";
			if (id % 3 == 0) html += "<div class='clear'></div>";
			res += html;
		});
		body = $(instance.window.document.body);
		body.find('.audio').html(res);
		body.find('.audio .similar').click(function(e){ last.getList($(this).find('.name').text()); });	
		instance.window.nativeWindow.activate(); 
		$('.progress').hide();
	}
	
	this.getAlbums = function(q) {
		id = 0;
		$('.progress').show();
		$('.audio .results').empty();
		list.artist = q;
		if (q == '') return;
		//q = cleanCharacters(q);
		q = cleanArgsLfm(q);
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, last.onGetAlbums);
		loader.load(new air.URLRequest('http://ws.audioscrobbler.com/2.0/artist/'+q+'/topalbums.xml'));
		//loader.load(new air.URLRequest(url+'method=artist.gettopalbums&artist='+q));		
	}
	
	this.onGetAlbums = function(e) {
		var result = $.xml2json(cleanU(e.target.data));
		var html = '<div class="bigtitle">'+result.artist+'</div>'
		$(result.album).each(function(){
			if (typeof(this.image) == 'undefined') return;
			id++;	
			if (typeof(this.image[0].size) == 'undefined') {
				var img =  this.image.replace(/\/34/,'/126');
			} else img = '';
			
			html += '<div class="el album" data-id="'+this.mbid+'" data-artist="'+this.artist.name+'"><img height="120" src="'+img+'"><br><b>'+this.name+'</b></div>';
			if (id % 3 == 0) html += "<div class='clear'></div>";
		});
		$('.audio .results').html(html);
		$('.progress').hide();
	}
	
	this.getAlbumTracks = function(e) 
	{
		id = 0;
		var album = $(this).find('b').text();
		var mbid = $(this).attr('data-id');
		var artist = cleanCharacters($(this).attr('data-artist'));
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, last.onGetAlbumTracks);
		if (mbid.length > 1)
			loader.load(new air.URLRequest(url+'method=album.getinfo&mbid='+mbid));
		else
			loader.load(new air.URLRequest(url+'method=album.getinfo&artist='+artist+'&album='+album));
	}
	
	this.onGetAlbumTracks = function(e) 
	{
		var result = $.xml2json(cleanU(e.target.data));
		var html = '<div class="smalltitle">'+result.album.artist+' - '+result.album.name+'</div>';
		$(result.album.tracks.track).each(function(){
			id++;
			art = this.artist.name.replace(/\(.*\)/g,"");
			var title = cleanName(this.name);
			html += '<div class="row release" data-id="'+id+'" data-artist="'+art+'" data-title="'+title+'"><div class="track"><b>'+art+'</b> - <span class="title">'+this.name+'</span></div><div class="info"></div></div>';
		});
		$('.audio .results').html(html);
		
	}
	
	this.createWnd = function() 
	{
		var wndOpts = new air.NativeWindowInitOptions();
		var path = air.File.applicationDirectory.resolvePath('similar.html');
		wndOpts.type = air.NativeWindowType.NORMAL;
		wndOpts.resizable = true;
		instance = air.HTMLLoader.createRootWindow(false, wndOpts, true);
		var nWnd = instance.window.nativeWindow;
		nWnd.minSize = new air.Point(400,530);
		nWnd.maxSize = new air.Point(400,900);
		nWnd.width = 325;
		nWnd.height = 530;
		instance.load(new air.URLRequest(path.url));
	}
	
	this.closeWnd = function()
	{
		instance.window.nativeWindow.close();
	}
	
}

var last = new LastFm();
last.createWnd();