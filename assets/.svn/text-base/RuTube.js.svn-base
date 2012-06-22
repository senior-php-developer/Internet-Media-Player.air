function RuTube() {
	var url = 'http://rutube.ru/cgi-bin/jsapi.cgi?', page = 1, query = '', relid = '';
	
	this.getVideos = function(q) {
		$('.progress').show();
		page = 1;
		query = q;
		vloader.addEventListener(air.Event.COMPLETE, rutube.onGetVideos);
		vloader.load(new air.URLRequest(url+'rt_mode=search&rt_search='+q));
		$('.video .results').html('');
	}
	
	this.onGetVideos = function(e) {
		$('.progress').hide();
		page++;
		vloader.removeEventListener(air.Event.COMPLETE, rutube.onGetVideos);
		var data = cleanU(e.target.data).replace(/'/g,'"');
		var start = data.indexOf('var tracks');
		var end = data.lastIndexOf('var pager');
		var data = data.slice(start + 25, end - 3);
		data = data.replace(/size: .*/g,'').replace(/playerCode: .*/g,'').replace(/playerCodeToShare: .*/g,'').replace(/description: .*/g,'');
		data = data.replace(/title: ".*".*".*/,'');
		data = data.replace(/"(.*|\s*): (.*|\s*)"/g,'"$1 $2"');
		data = data.replace(/\s([a-zA-Z0-9]+): /g,'"$1":');
		data = data.replace(/} ,/g,'},').replace(/(\s)+/g,' ');
		data = '{"response": [' + data + ']}';
		data = $.parseJSON(data);
		$(data.response).each(function(){
			var html = "<div class='el rut' data-owner='"+ this.author +"' data-url='"+ this.playerLink +"' ><img style='height: 75px;' src='"+ this.thumbnailMediumLink +"' title='"+this.title+"'><div class='info'>"+ this.title +"</div><em>"+ this.duration +"</em></div>";
				//html += "<div class='tooltip'><div class='title'>"+ d.title +"</div></div>";
				$(".video .results").append(html);
		});
		if ((typeof(data.response) != 'undefined') && (data.response.length >= 20))
			$('.video .results').append("<div style='display: block; clear: both; text-align: center;'><button class='moar rutube'>Get More Videos!</button></div>");
		setupTitle();
	}
	
	this.getMore = function() {
		$('.progress').show();
		vloader.addEventListener(air.Event.COMPLETE, rutube.onGetVideos);
		vloader.load(new air.URLRequest(url+'rt_mode=search&rt_page='+page+'&rt_search='+query));
		$('.video .results .moar').parent().remove();
	}
}

var rutube = new RuTube(); 

