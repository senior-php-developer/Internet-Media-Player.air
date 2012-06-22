function Yandex() {
	var url = 'http://video.yandex.ru/search.xml?where=yandex&text=';
	var page = 0;
	var query = '';
	
	this.getList = function(q) {
		page = 0;
		$('.progress').show();
		if (q == '') return;
		query = q;
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, yandex.onGetList);
		loader.load(new air.URLRequest(url+q));
		$('.video .results').html('');
	}
	
	this.onGetList = function(e){
		$('.progress').hide();
		var data = e.target.data;
		var count = parseInt($('.b-found strong',$(data)).text());
		var total = parseInt(count / 20);
		var res = $('#wrapable-table .r1 td',$(data));
		if (res.length == 0) return;
		$(res).each(function(){
			var cls = $(this).attr('class');
			var link = $(this).find('.show-player').attr('href');
			var img = $(this).find('.show-player img').attr('src');
			var title = $('#wrapable-table .r2 td.'+cls+' .title',$(data)).text();
			var dur = $('#wrapable-table .r2 td.'+cls+' .b-duration',$(data)).text();
			var html = "<div class='el ya' data-url='"+link+"' title='"+title+"'><img height='75' width='100' src='"+img+"'><div class='info'>"+title+"</div><em>"+dur+"</em></div>";
			$('.video .results').append(html);
		});
		if (page < total)
			$('.video .results').append("<div style='display: block; clear: both; text-align: center;'><button class='moar ya'>Get More Videos!</button></div>");
		setupTitle();
	}
	
	this.getMore = function() {
		$('.progress').show();
		page++;
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, yandex.onGetList);
		loader.load(new air.URLRequest(url+query+'&p='+page));
		$('.video .results .moar').parent().remove();
	}
	
	this.getLink = function(e) {
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, yandex.onGetLink);
		loader.load(new air.URLRequest($(this).attr('data-url')));
	}
	
	this.onGetLink = function(e) {
		var data = e.target.data;
		var text = $('.b-media-info .code .h-part:eq(1) .part textarea',$(data)).val();
		var url = /http:\/\/.*\/\]/.exec(text)[0];
		url = url.substr(0,url.length-1);
		var wndOpts = new air.NativeWindowInitOptions();
		wndOpts.type = air.NativeWindowType.UTILITY;
		wndOpts.minimizable = true;
		var loader = air.HTMLLoader.createRootWindow(false, wndOpts, false);
		loader.window.nativeWindow.width = 480;
		loader.window.nativeWindow.height = 360;
		loader.load(new air.URLRequest(url));
		loader.window.nativeWindow.activate();
	}
	
	this.liveSearch = function() {
		var q = $.trim($('.video .query').val());
		if (q == '') {
			$('.video .search .live').html('').hide();
			return;
		}
		$('.progress').show();
		query = q;
		$.get("http://sitesuggest.yandex.ru/suggest-ya.cgi?v=2&site=video&part="+q, yandex.onLiveSearch);
	}
	
	this.onLiveSearch = function(r) {
		var json = r.replace(/suggest\.apply\(/,'{').replace(/\]\)$/,']}').replace(/", \[/,'":[');
		var data = $.parseJSON(json);
		var html = '';
		$(data[query]).each(function(){
			if ((this == undefined) || (typeof(this) == 'undefined')) continue;
			html += '<div data-query="'+encURI(this)+'">'+this+'</div>';
		});
		if (html != '')
			$('.video .search .live').html(html).slideDown('fast');
		else
			$('.video .search .live').html('').hide();
		$('.progress').hide();
		
	}
	
	this.liveSearchSelect = function(e) {
		var q = decURI($(this).attr('data-query'));
		$('.video .search .query').val(q);
		findVideo();
	}
}

var yandex = new Yandex();
