function YouTube() {
	var url = 'http://gdata.youtube.com/feeds/api/', step = 0, query = '', relid = '';
	
	this.getVideos = function(q) {
		$('.progress').show();
		step = 0;
		query = q;
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, youtube.onGetVideos);
		loader.load(new air.URLRequest(url+'videos?max-results=48&alt=json&q='+q));
		$('.video .results').html('');
	}
	
	this.onGetVideos = function(e) {
		$('.progress').hide();
		step += 49;
		var data = $.parseJSON(cleanU(e.target.data));
		$(data.feed.entry).each(function(){
			var dur = this.media$group.yt$duration.seconds;
			var duration = parseInt( dur / 60) + ":" + ((dur % 60) > 9 ? dur % 60 : "0" + dur % 60 );
			var vid_id = /watch\?v=(.*)&/.exec(this.link[0].href);
			var html = "<div class='el yt' data-id='"+vid_id[1]+"' data-owner='"+ this.author[0].name +"' data-url='"+ this.link[0].href.replace(/watch\?v=/,'v/') +"' title='"+this.title.$t+"'><img src='"+ this.media$group.media$thumbnail[0].url +"'><div class='info'>"+ this.title.$t +"</div><em>"+ duration +"</em></div>";
				//html += "<div class='tooltip'><div class='title'>"+ d.title +"</div></div>";
				$(".video .results").append(html)
		});
		if ((typeof(data.feed.entry) != 'undefined') && (data.feed.entry.length > 47))
			$('.video .results').append("<div style='display: block; clear: both; text-align: center;'><button class='moar youtube'>Get More Videos!</button></div>");
		setupTitle();
	}
	
	this.getMore = function() {
		$('.progress').show();
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, youtube.onGetVideos);
		loader.load(new air.URLRequest(url+'videos?max-results=48&alt=json&q='+query+'&start-index='+step));
		$('.video .results .moar').parent().remove();
	}
	
	this.getRelated = function(id) {
		$('.progress').show();
		step = 0;
		relid = id;
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, youtube.onGetRelated);
		loader.load(new air.URLRequest(url+'videos/'+id+'/related?max-results=50&alt=json'));
		$('.video .results').empty();
	}
	
	this.onGetRelated = function(e) {
		$('.progress').hide();
		if (step == 0) step += 51;
		else step += 49;
		var data = $.parseJSON(cleanU(e.target.data));
		$(data.feed.entry).each(function(){
			var dur = this.media$group.yt$duration.seconds;
			var duration = parseInt( dur / 60) + ":" + ((dur % 60) > 9 ? dur % 60 : "0" + dur % 60 );
			var vid_id = /watch\?v=(.*)&/.exec(this.link[0].href);
			var html = "<div class='el yt' data-id='"+vid_id[1]+"' data-owner='"+ this.author[0].name +"' data-url='"+ this.link[0].href.replace(/watch\?v=/,'v/') +"' ><img src='"+ this.media$group.media$thumbnail[0].url +"'><div class='info'>"+ this.title.$t +"</div><em>"+ duration +"</em></div>";
				//html += "<div class='tooltip'><div class='title'>"+ d.title +"</div></div>";
				$(".video .results").append(html)
		});
		if ((typeof(data.feed.entry) != 'undefined') && (data.feed.entry.length > 47))
			$('.video .results').append("<div style='display: block; clear: both; text-align: center;'><button class='moar rel'>Get More Videos!</button></div>");
	}
	
	this.getMoreRelated = function() {
		$('.progress').show();
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, youtube.onGetRelated);
		loader.load(new air.URLRequest(url+'videos/'+relid+'/related?max-results=48&alt=json&start-index='+step));
		$('.video .results .moar').remove();
	}	
		
	this.liveSearch = function() {
		var q = $.trim($('.video .query').val());
		if (q == '') {
			$('.video .search .live').html('').hide();
			return;
		}
		$('.progress').show();
		query = q;
		$.get('http://suggestqueries.google.com/complete/search?hl=en&ds=yt&jsonp=klr&q='+q, youtube.onLiveSearch);
	}
	
	this.onLiveSearch = function(r) {
		var json = r.replace(/klr\(/,'{"result":').replace(/\]\)$/,']}');
		var data = $.parseJSON(json);
		var html = '';
		$(data.result[1]).each(function(){
			if ((this[0] == undefined) || (typeof(this[0]) == 'undefined')) continue;
			html += '<div data-query="'+encURI(this[0])+'">'+this[0]+'</div>';
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

var youtube = new YouTube();


