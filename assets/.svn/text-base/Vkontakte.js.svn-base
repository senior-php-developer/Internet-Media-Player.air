function Vkontakte() {
	var sett = {sort:1, offset:0, asort: 0, short:1, query: ''} 
	var list = {found: [], results: [], id: 0}
	
	this.getList = function(q, what) {
		sett.offset = 0;
		sett.sort = 1;
		list.found.splice(0,list.found.length);
		list.results.splice(0,list.results.length);
	
		sett.short = settings.audio.short;
		sett.query = q;
		
		$('.audio .results').empty();				
		vka.getFiles();	
	}
	
	this.getFiles = function() {
		$('.progress').show();
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, vka.onGetFiles);
		sendRequest({method: 'audio.search', q: sett.query, sort: sett.sort, count: 200, offset: sett.offset}, loader);
		sett.offset += 200;
	} 
	
	this.onGetFiles = function(e) {
		$('.progress').hide();
		var data = $.parseJSON(cleanU(e.target.data));		
		for(key in data.response) {
			var d = data.response[key];
			if (d.duration > 900) continue
			if (d.duration < 150) continue	
			if (d.title == undefined) continue
			
			var words = sett.query.split(' ');
			var stop = false;
			$(words).each(function(k,v) {
				if (nsp(d.artist).indexOf(nsp(v)) == -1 && nsp(d.title).indexOf(nsp(v)) == -1) stop = true;
			});
			if (stop) continue;

			d.artist = cleanName(d.artist.replace(/\(.*\)/g,""));
			d.title = cleanTitle(d.title);

			if ((d.artist == '') || (d.title == '')) continue;
			if (d.artist.length > 40) d.artist = d.artist.substr(0,40);
			
			if (!in_array(d.title, list.found)) {
				list.id++;
				if (d.artist.length < 2) d.artist = sett.query;
				if (parseInt(d.artist.length) + parseInt(d.title.length) > 62) var marq = 'long'; else var marq = '';
				var html = "<div data-id='"+list.id+"' class='row vk' data-url='"+d.url+"' data-artist='"+d.artist+"' data-title='"+d.title+"' data-offset='0'><div class='track "+marq+"'><b>"+d.artist+"</b> - <span class='title'>"+d.title+"</span></div> <div class='info hide'>"+mkTime(d.duration)+"</div></div>";
				list.results.push({dur: d.duration, html: html, title: d.title});
				$(".audio .results").append(html);
				list.found.push(btrim(d.title));
			}
		}
		
		if ((sett.offset >= 2000) || (sett.short == 1)) {
			if (sett.sort == 1) {
				sett.offset = 0; 
				sett.sort = 0;
				vka.getFiles();
			} else if (sett.sort == 0) {
				aloader.removeEventListener(air.Event.COMPLETE, vka.onGetFiles);
				setTimeout(function(){
					vka.showResults();
				}, 1000);
			}
		} else
			vka.getFiles();	
	}
	
	this.showResults = function() {
		list.results.sort(sortTitle);
		var html = "";
		for(key in list.results) {
			html += list.results[key].html
		}
		$(".audio .results").html(html);
		$(".audio .results .info").show();
		$(".audio .count").html(list.results.length+" tracks");
		sett.sort = -1;
	}
			

}
var vka = new Vkontakte();
