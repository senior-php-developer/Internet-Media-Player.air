function VideoSearch() {
	var query = "", sort = 0, offset = 0, quality = 0, grain = 0, timer = 0;
	var found = [];
	var sources = {wnd: null, el: null, dur: 0}
	
	this.getList = function(q, s) {
		$('.progress').show();
		id = 0;
		clearInterval(timer);
		offset = 0;
		grain = 0;
		found.splice(0,found.length);
		$('.video .results').empty();
		query = q;
		sort = $('.video .sort:checked').val();
		quality = $('.video .quality:checked').val();
		$('.video .grain:checked').each(function(){
			grain += parseInt($(this).val());
		});
		video.getFiles();	
	} 
		
	this.getFiles = function() {
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, video.onGetFiles);
		sendRequest({method: 'video.search', q: query, hd: quality, sort: sort, count: 100, offset: offset}, loader);
		offset += 100;
	}
	
	this.onGetFiles = function(e) {
		var data = $.parseJSON(cleanU(e.target.data));		
		for(key in data.response) {
			var d = data.response[key];
			if (d.duration < 20) continue	
			if (d.title == undefined) continue
			var words = query.split(' ');
			var stop = false;
			$(words).each(function(k,v) {
				if ((grain == '1') && (d.title.toLowerCase().indexOf(v.toLowerCase()) == -1))	stop = true;
				if ((grain == '2') && (d.description.toLowerCase().indexOf(v.toLowerCase()) == -1)) stop = true;
				if ((grain == '3') && (d.title.toLowerCase().indexOf(v.toLowerCase()) == -1) &&  (d.description.toLowerCase().indexOf(v.toLowerCase()) == -1)) stop = true;
			});
			if (stop) continue;
			id++;
			
			var duration = parseInt(d.duration / 60) + ":" + ( (d.duration % 60) > 9 ? d.duration % 60 : "0" + d.duration % 60 );
			
			if (vkArray(d.duration, found)) {
				found[d.duration].push({'id': d.id, 'owner': d.owner_id, 'title':d.title});
				continue;
			}
			else 
				found[d.duration] = [{'id': d.id, 'owner': d.owner_id, 'title':d.title}];
			var html = "<div class='el vk' data-id='"+ d.id +"' data-duration='"+d.duration+"' data-owner='"+ d.owner_id +"'  title='"+d.title+"'> <img src='"+ d.thumb +"'><div class='info'>"+ d.title +"</div><em>"+ duration +"</em></div>";
			$(".video .results").append(html)
		}
		// get more button behavior
		if (sort == 0)  {
			if ((offset < 1000) && (data.response.length > 99)) {
				$('.video .results').append("<div style='display: block; clear: both; text-align: center;'><button class='moar vkadre'>Get More Videos!</button></div>");	
			}
			setupTitle();
			$('.progress').hide();
		}
		
		if (sort == 1) {
			if ((offset < 1000) && (data.response.length > 99))
				video.getMore();
			else {
				setupTitle();
				$('.progress').hide();
			}
		}
	}
	
	this.getMore = function() {
		$('.progress').show();
		$('.video .results .moar').parent().remove();
		video.getFiles();
	}	
	
	
	this.openSetup = function() {
		switch(vSrcType) {
			case '1': $('.video .setup.vk').slideToggle('fast');	break;
		}
	}
	
	this.selectCat = function(e) {
		$('.video .categories').hide();
		$('.video .setup').hide();
		vSrcType = $(this).attr('data-type');
		$('.video .search .cur-cat').text($(this).text());
		if (vSrcType == '1')
			$('.video .searchbox .btn-setup').show();
		else
			$('.video .searchbox .btn-setup').hide();
	}
	
	this.loadVideo = function(e) {
		$('.video .el').removeClass('active');
		$(this).addClass('active');
		var url = 'http://vkontakte.ru/video.php?act=a_embedbox&oid='+$(this).attr('data-owner')+'&vid='+$(this).attr('data-id');
		sloader.load(new air.URLRequest(url));
	}
	
	this.openVideo = function(e) {
		$('.video .el').removeClass('active');
		$(this).addClass('active');
		var url = $(this).attr('data-url');
		var wndOpts = new air.NativeWindowInitOptions();
		wndOpts.type = air.NativeWindowType.UTILITY;
		wndOpts.minimizable = true;
		var loader = air.HTMLLoader.createRootWindow(true, wndOpts, false);
		loader.window.nativeWindow.width = 480;
		loader.window.nativeWindow.height = 360;
		loader.load(new air.URLRequest(url));
	}
	
	this.openSources = function(t) {
		sources.dur = t.attr('data-duration'); 
		var wndOpts = new air.NativeWindowInitOptions();
		var path = air.File.applicationDirectory.resolvePath('remixes.html');
		wndOpts.type = air.NativeWindowType.UTILITY;
		wndOpts.resizable = true;
		sources.wnd = air.HTMLLoader.createRootWindow(false, wndOpts, true);
		var nWnd = sources.wnd.window.nativeWindow;
		sources.wnd.addEventListener(air.Event.COMPLETE, video.onOpenSources);
		nWnd.width = 400;
		nWnd.height = 500;
		nWnd.maxSize = new air.Point(500,700);
		nWnd.minSize = new air.Point(400,500)
		nWnd.title = "Sources"
		sources.wnd.load(new air.URLRequest(path.url));
		
		
	}
	
	this.onOpenSources = function(e) {
		sources.wnd.removeEventListener(air.Event.COMPLETE, video.onOpenSources);
		var body = $(sources.wnd.window.document.body);
		var html = '';
		var arr = found[sources.dur];
		for(var i in arr) {
			html += '<div class="rmx" data-owner="'+arr[i].owner+'" data-id="'+arr[i].id+'">'+arr[i].title+'</div>';
			
		}
		body.find('.remixes').html(html);
		body.find('.remixes > div').live('click', video.loadVideo);	
		sources.wnd.window.nativeWindow.activate();
	}
	
}
var video = new VideoSearch();
