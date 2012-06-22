function Playlist() {
	var instance = null;
	var body = null;
	this.queue = [];
	this.doc = null;
	this.playlist = null;
	
	this.open = function(){
		if (instance == null) 
			playlist.create();
		instance.window.nativeWindow.activate(); 
	}
	
	this.close = function() {
		instance.window.nativeWindow.close();
	}
	
	this.create = function() {
		var wndOpts = new air.NativeWindowInitOptions();
		var path = air.File.applicationDirectory.resolvePath('playlist.html');
		wndOpts.type = air.NativeWindowType.NORMAL;
		wndOpts.resizable = true;
		instance = air.HTMLLoader.createRootWindow(false, wndOpts, true);
		var nWnd = instance.window.nativeWindow;
		nWnd.minSize = new air.Point(325,420);
		nWnd.maxSize = new air.Point(325,960);
		instance.addEventListener(air.Event.COMPLETE, playlist.onCreate);
		nWnd.addEventListener(air.Event.CLOSING, playlist.onClose);
		nWnd.width = 325;
		nWnd.height = 420;
		instance.load(new air.URLRequest(path.url));
	}
	
	this.onCreate = function(e) {
		body = $(instance.window.document.body);	
		body.find('.playlist .row').live('click',playlist.playTrack);	
		body.find('.playlist .row').live('contextmenu', menu.showPlaylist);
		body.find('.control .buttons #clear').live('click', playlist.clear);
		body.find('.control .buttons #save').live('click', playlist.showSave);
		body.find('.control .buttons #open').live('click', playlist.showLoad);
		readSettings();
	}
	
	this.onClose = function(e) {
		instance.window.nativeWindow.visible = false;
		e.preventDefault();
	}
	
	this.getWindow = function() {
		return instance;
	}
	
	this.getBody = function() {
		return body;
	}
	
	this.showLoad = function() {
		var pls = air.File.desktopDirectory;
		pls.addEventListener(air.Event.SELECT, playlist.load);
		pls.browseForOpen("Open playlist");	
    
	}
	
	this.load = function(e) {
		var stream = new air.FileStream();
		stream.open(e.target, air.FileMode.READ);
		body.find('.playlist').html(stream.readUTFBytes(stream.bytesAvailable));
		stream.close();
	}
	
	this.showSave = function() {
		var pls = air.File.desktopDirectory;
		pls.addEventListener(air.Event.SELECT, playlist.save);
		pls.browseForSave("Save playlist as");	
    
	}
	
	this.save = function(e) {
		var stream = new air.FileStream();
		var str = body.find('.playlist').html();
		stream.open(e.target, air.FileMode.WRITE);
		stream.writeUTFBytes(str);
		stream.close();
	}
	
	this.clear = function() {
		body.find('.playlist').empty();
	}
	
	this.addTracks = function(t) {
		if ((t.attr('data-url') == '') || (t.attr('data-url') == undefined)) {
			$('.progress').show();
			playlist.queue.push(t);
			var loader = new air.URLLoader();
			loader.addEventListener(air.Event.COMPLETE, playlist.onFindSource);
			var q = cleanName(t.attr('data-artist')) + " " + t.attr('data-title');
			sendRequest({method: 'audio.search', q: q, sort: 0, count: 200, offset: 0}, loader);
		} else {
			var singer = t.find('.track b').text();
			var song = short(t.find('.title').text(),46-singer.length);
			var dur = t.find('.info').text();
			var url = t.attr('data-url');
			body.find('.playlist').append("<div class='row pl' data-url='"+url+"'><div class='track'><b>"+singer+"</b> - <span class='title'>"+song+"</span></div><div class='info'>"+dur+"</div></div>");
		}
		
	}
	
	this.onFindSource = function(e) {
		$('.progress').hide();
		var t = playlist.queue.shift();
		var src = audio.getFileSource(e, {artist: t.attr('data-artist'), track: t.attr('data-title'), id: t.attr('data-id')});
		if (src === false) return;
		if (src.found === true) {
			t.attr('data-url',src.d.url).attr('data-offset','0').attr('data-duration','600').find('.info').html(mkTime(src.d.duration));
			playlist.addTracks(t);
		}
	}
	
	this.playTrack = function(e) {
		var t = $(e.currentTarget);
		body.find('.row').removeClass('active');
		$('.audio .row').removeClass('active');
		t.addClass('active');
		$("#jquery_jplayer").jPlayer("setFile", t.attr('data-url')).jPlayer("play");
		$('.audio .play-info').html('<div class="track"><b>'+t.find('.track b').text()+'</b> - '+t.find('.title').text()+'</div>');
	}

}
var playlist = new Playlist();
playlist.create();