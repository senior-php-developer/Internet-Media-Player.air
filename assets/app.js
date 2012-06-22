//air.Introspector.Console.log('ww');

var auth = {}, settings = {}, queue = [], recent = {}, getDl = [];
var app = {short: 0, mode:1}
var request = new air.URLRequest(), vloader = new air.URLLoader(), aloader = new air.URLLoader(), sloader = new air.URLLoader(), dloader = new air.URLLoader();
var aSrcType = '1', vSrcType = '1';

var appUpdater = new runtime.air.update.ApplicationUpdaterUI();

function checkUpdate() {
	appUpdater.updateURL = "http://imp.airy.me/update.xml";
	appUpdater.addEventListener(runtime.air.update.events.UpdateEvent.INITIALIZED, onUpdate);
	appUpdater.addEventListener(runtime.flash.events.ErrorEvent.ERROR, onUpdateError);
	appUpdater.isCheckForUpdateVisible = false;
  appUpdater.initialize();
}

function onUpdate(event) {
	appUpdater.checkNow();
}

function onUpdateError() {
	
}


var menu = {
	closelive: 0,	closecats: 0, closetop: 0, livesearch: 0, target: null,
	audio: new air.NativeMenu(), playlist: new air.NativeMenu(), youtube: new air.NativeMenu(), vkadre: new air.NativeMenu(),
	showAudio: function(event) { 
		event.preventDefault(); 
		menu.artist = $(event.currentTarget).attr('data-artist');
		menu.target = $(event.currentTarget);
		menu.parent = $(event.currentTarget).parent();
		if (typeof menu.target.attr('data-url') == 'undefined') {
			menu.audio.getItemAt(5).enabled = false;
			menu.audio.getItemAt(6).enabled = false;
		} else {
			menu.audio.getItemAt(5).enabled = true;
			menu.audio.getItemAt(6).enabled = true;
		}
		menu.audio.display(window.nativeWindow.stage, event.clientX, event.clientY); 
	},
	showPlaylist: function(event) {
		event.preventDefault();
		menu.artist = $(event.currentTarget).attr('data-artist');
		menu.target = $(event.currentTarget);
		menu.parent = $(event.currentTarget).parent();
		menu.playlist.display(playlist.getWindow().window.nativeWindow.stage, event.clientX, event.clientY); 
	},
	showVkadre: function(event) {
		event.preventDefault();
		menu.target = $(event.currentTarget); 
		menu.vkadre.display(window.nativeWindow.stage, event.clientX, event.clientY);
	},
	showYoutube: function(event) {
		event.preventDefault(); 
		menu.ytID = $(event.currentTarget).attr('data-id');
		menu.youtube.display(window.nativeWindow.stage, event.clientX, event.clientY);
	},
	create: function() {
		menu.audio.addItem(new air.NativeMenuItem("To Playlist")).addEventListener(air.Event.SELECT, function(){playlist.addTracks(menu.target)});
		menu.audio.addItem(new air.NativeMenuItem("Download")).addEventListener(air.Event.SELECT, function(){audio.download(menu.target)});
		menu.audio.addItem(new air.NativeMenuItem("Remove")).addEventListener(air.Event.SELECT, function(){menu.target.remove()});
		menu.audio.addItem(new air.NativeMenuItem('',true));
		
		menu.audio.addItem(new air.NativeMenuItem("Remixes")).addEventListener(air.Event.SELECT, function(){audio.getRemixes(menu.target)});
		menu.audio.addItem(new air.NativeMenuItem("Source")).addEventListener(air.Event.SELECT, function(){audio.changeSource(menu.target)});	
		menu.audio.addItem(new air.NativeMenuItem("Copy link")).addEventListener(air.Event.SELECT, function(){copyLink(menu.target)});
		menu.audio.addItem(new air.NativeMenuItem("Lyrics")).addEventListener(air.Event.SELECT, function(){audio.getLyrics(menu.target)});
		menu.audio.addItem(new air.NativeMenuItem('',true));
		
	  menu.audio.addItem(new air.NativeMenuItem("Top Tracks")).addEventListener(air.Event.SELECT, function(){last.getList(menu.artist)});
		menu.audio.addItem(new air.NativeMenuItem("Albums")).addEventListener(air.Event.SELECT, function(){last.getAlbums(menu.artist)});
		menu.audio.addItem(new air.NativeMenuItem("Similar")).addEventListener(air.Event.SELECT, function(){last.getSimilar(menu.artist)});
		menu.audio.addItem(new air.NativeMenuItem("Releases")).addEventListener(air.Event.SELECT, function(){disc.getArtist(menu.artist)});
		
		menu.playlist.addItem(new air.NativeMenuItem("Download")).addEventListener(air.Event.SELECT, function(){audio.download(menu.target)});
		menu.playlist.addItem(new air.NativeMenuItem("Remove")).addEventListener(air.Event.SELECT, function(){$(menu.target).remove()});
		
		menu.youtube.addItem(new air.NativeMenuItem("Related")).addEventListener(air.Event.SELECT, function(){youtube.getRelated(menu.ytID)});
		
		menu.vkadre.addItem(new air.NativeMenuItem("Source")).addEventListener(air.Event.SELECT, function(){video.openSources(menu.target)});
		
		$('.audio .artist, .audio .last, .audio .vk, .audio .release, .audio .top').live('contextmenu', menu.showAudio);
		$('.video .vk').live('contextmenu', menu.showVkadre);
		$('.video .yt').live('contextmenu', menu.showYoutube);
	}
}




function doLogin() {
	checkUpdate();
	var wndOpts = new air.NativeWindowInitOptions();
	wndOpts.type = air.NativeWindowType.UTILITY;
	wndOpts.resizable = false;
	var wnd = air.HTMLLoader.createRootWindow(false, wndOpts, false);
	wnd.window.nativeWindow.height = 280;
	wnd.window.nativeWindow.width = 490;
	wnd.addEventListener(air.Event.COMPLETE, onLogin);
	wnd.load(new air.URLRequest('http://vkontakte.ru/login.php?app=1918220&layout=popup&type=browser&settings=24'));
}


function onLogin(e) {
	if (e.target.location.toString().indexOf('success') != -1) {
		e.target.removeEventListener(air.Event.COMPLETE, onLogin);
		var location = e.target.location.toString();
		location = unescape(location);
		location = /http.*session=(.*)/.exec(location);
		window.auth = $.parseJSON(location[1]);
		e.target.parent.nativeWindow.close();
	} else {
		e.target.parent.nativeWindow.activate();
	}
		
}

function readSettings() {
	var stream = new air.FileStream();
	var pref = air.File.applicationStorageDirectory.resolvePath("preferences.xml");
	var s = {audio: {}, video: {}}
	if (pref.exists) {
		stream.open(pref, air.FileMode.READ);
		s = $.xml2json(stream.readUTFBytes(stream.bytesAvailable));
		stream.close();
	}
	
	settings.audio = {short: s.audio.short || 1, tracks: s.audio.tracks || 50}
	settings.video = {sort: s.video.sort || 1, grain: s.video.grain || 1}
	settings.downloadPath = s.downloadPath;
	
	$('.settings .tracksnum').val(settings.audio.tracks);
	if (settings.audio.short == 1) $('.audio .settings .short').attr('checked','checked');
	
	if (settings.video.sort == 1)	$('.video .setup #sort2').attr('checked','checked');
		else	$('.video .setup #sort1').attr('checked','checked');
	if (settings.video.grain == 1)	$('.video .setup #grain4').attr('checked','checked');
		else if (settings.video.grain == 2)	$('.video .setup #grain5').attr('checked','checked');
		else $('.video .setup .grain').attr('checked','checked');
	
	if (typeof(settings.downloadPath) != 'undefined')
		window.downpath = air.File.desktopDirectory.resolvePath(settings.downloadPath);
	else
		window.downpath = air.File.desktopDirectory.resolvePath('downloads');
	$('.settings .download input').val(downpath.nativePath);	
	
	// latest search
	recent.audio = [];
	var rs = air.File.applicationStorageDirectory.resolvePath("audio.src");
	if (rs.exists) {
		stream.open(rs, air.FileMode.READ);
		if (stream.bytesAvailable == 0) return;
		$('.audio .results').html('<div class="bigtitle">Recent Search Results</div><div class="clr">'+stream.readUTFBytes(stream.bytesAvailable)+'</div>');
		stream.close();
		$('.audio .results .recent').each(function(){
			recent.audio.push('<div class="recent">'+this.innerHTML+'</div>');
		});
	}
	// playlist
	var pls = air.File.applicationStorageDirectory.resolvePath("audio.pls");
	if (pls.exists) {
		stream.open(pls, air.FileMode.READ);
		playlist.getBody().find('.playlist').html(stream.readUTFBytes(stream.bytesAvailable));
		stream.close();
	}
}

function saveSettings() {
	var stream = new air.FileStream();
	settings.downloadPath = [$('.settings .download input').val()];
	settings.audio = {};
	settings.audio.short = ($('.settings .short:checked').val() == 1) ? ['1'] : ['-1'];
	settings.audio.tracks = [$('.settings .tracksnum').val()];

	settings.video = {};
	settings.video.sort = [$('.video .setup .sort:checked').val()]
	var grain = 0;
	$('.video .grain:checked').each(function(){
		grain += parseInt($(this).val());
	});
	settings.video.grain = [grain];
	
	var str = '<?xml version="1.0" encoding="utf-8"?>\n';
	str += $.json2xml(settings, {formatOutput: true, rootTagName: 'preferences'});
	var pref = air.File.applicationStorageDirectory.resolvePath("preferences.xml");
	stream.open(pref, air.FileMode.WRITE);
	stream.writeUTFBytes(str);
	stream.close();
	
	var str = '';
	if (recent.audio.length > 9) var c = 9; else var c = recent.audio.length;
	for(var i = 0; i<c; i++) {
		str += recent.audio[i];
	}
	var rs = air.File.applicationStorageDirectory.resolvePath("audio.src");
	stream.open(rs, air.FileMode.WRITE);
	stream.writeUTFBytes(str);
	stream.close();

	var str = playlist.getBody().find('.playlist').html();
	var pls = air.File.applicationStorageDirectory.resolvePath("audio.pls");
	stream.open(pls, air.FileMode.WRITE);
	stream.writeUTFBytes(str);
	stream.close();
}

function videoLoaded(e) {
	var obj = $.parseJSON(e.target.data);
	var str = /vkontakte.ru\/(.*)"/.exec(obj.script.toString());
	var url = str[1].replace('"','');
	var wndOpts = new air.NativeWindowInitOptions();
	wndOpts.type = air.NativeWindowType.UTILITY;
	var loader = air.HTMLLoader.createRootWindow(false, wndOpts, false);
	loader.window.nativeWindow.width = 480;
	loader.window.nativeWindow.height = 360;
	loader.load(new air.URLRequest('http://vkontakte.ru/'+url));
	loader.window.nativeWindow.activate();
}


function findMusic() {
	var q = $('.audio .query').val();
	if (q == '') return;
	closeMenus();
	
	switch(aSrcType) {
		case '1': last.getList(q); break;
		case '2': last.getAlbums(q); break;
		case '3': last.getSimilar(q); break;
		case '4': disc.getArtist(q); break;
		case '5': disc.getLabel(q); break;
		case '6': vka.getList(q); break;
	}
}

function findVideo() {
	var q = $('.video .query').val();
	if (q == '') return;
	closeMenus();
	
	switch(vSrcType) {
		case '1': video.getList(q); break;
		case '2': yandex.getList(q); break;
		case '3': youtube.getVideos(q); break;
		case '4': rutube.getVideos(q); break;
	}
		;	
}

function processQueue() {
	if (queue.length == 0) return;
	if (queue[0].status == 'waiting') {
		queue[0].t.removeClass('queue').addClass('downbg');
		queue[0].status = 'downloading';
		download(queue[0].url, queue[0].name);
	}	
}

function download(url, fileName) {
	fileName = cleanFile(fileName);
	var urlStream = new air.URLStream();
  var fileStream = new air.FileStream();

  function writeFile() {
    if (urlStream.bytesAvailable > 51200) {
      var dataBuffer = new air.ByteArray();
      urlStream.readBytes(dataBuffer, 0, urlStream.bytesAvailable);
      fileStream.writeBytes(dataBuffer, 0, dataBuffer.length);
    }
  }
	
	function finishFile() {
		var dataBuffer = new air.ByteArray();
    urlStream.readBytes(dataBuffer, 0, urlStream.bytesAvailable);
    fileStream.writeBytes(dataBuffer, 0, dataBuffer.length);
    fileStream.close();
    urlStream.close();
		notification(fileName);
		queue[0].t.removeClass('downbg');
		queue.shift();
		processQueue();
	}

  urlStream.addEventListener(air.Event.COMPLETE, finishFile);
  urlStream.addEventListener(air.ProgressEvent.PROGRESS, writeFile);
	
	downpath.createDirectory();
	var file = downpath.resolvePath(fileName);
  fileStream.openAsync(file, air.FileMode.WRITE);

  urlStream.load(new air.URLRequest(url));

}

function notification(fileName) {
	var init = new air.NativeWindowInitOptions();
	var bounds = new air.Rectangle((air.Capabilities.screenResolutionX-222), 10, 212, 72);
	init.type = air.NativeWindowType.LIGHTWEIGHT;
	init.systemChrome = air.NativeWindowSystemChrome.NONE;
	var win = air.HTMLLoader.createRootWindow(true, init, false, bounds);
	win.addEventListener(air.Event.COMPLETE, closeNotification);
	win.loadString('<style>#body {background: #FDFFA9;border:1px solid #BCB884;height:60px;overflow:hidden; width:200px;font-size:11px;padding:5px; line-height: 170%;}</style><div id="body">'+fileName+' downloaded!</div>');
}

function closeNotification(e) {
	setTimeout(function(){
		e.target.window.nativeWindow.close();
	}, 3000);
}

function browseDownload() {
	window.file = air.File.desktopDirectory;
	file.addEventListener(air.Event.SELECT, onBrowseDownload);
	file.browseForDirectory("Choose your download path:");
}

function onBrowseDownload(e) {
	var path = file.nativePath;
	$('.settings .download input').val(path);
	downpath = air.File.desktopDirectory.resolvePath(path);
}

function closeApp() {
	saveSettings();
	playlist.close();
	window.nativeWindow.close();
}


function copyLink(t) {
	var url = t.attr('data-url');
	if ((url == undefined) || (url == '')) return;
	air.Clipboard.generalClipboard.clear();
	air.Clipboard.generalClipboard.setData(air.ClipboardFormats.TEXT_FORMAT, url);
}
 
function closeCats() {
	$('.audio .search .categories, .video .search .categories').hide();
}

function closeLive() {
	$('.audio .search .live, .video .search .live').hide();
}

function closeTop() {
	$('.audio .radio-top').hide();
}

function closeMenus() {
	closeLive();
	closeCats();
	closeTop();
	$(".setup").hide();
	clearTimeout(menu.livesearch);
} 

function setupTitle() {
	$("[title]").mbTooltip({opacity : .85, wait:200, cssClass:"default", timePerWord:70, hasArrow:false,  hasShadow:true, imgPath:"images/", ancor:"parent", shadowColor:"black", mb_fade:80});
}
