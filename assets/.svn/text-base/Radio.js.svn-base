function Radio() {
	
	
	this.getTop = function(e) {
		$('.progress').show();
		closeTop();
		var name = $(this).text();
		var q = $(this).attr('data-type');
		var arg = $(this).attr('data-arg');
		var src = $(this).attr('data-source');
		var loader = new air.URLLoader();
		loader.addEventListener(air.IOErrorEvent.IO_ERROR, cancelLoad);
		if (src == 'prosto') {
			$('.audio .results').html('<div class="bigtitle">Top 100 for '+name+'</div>');
			loader.addEventListener(air.Event.COMPLETE, radio.onGetTopProsto);
			loader.load(new air.URLRequest('http://prostopleer.com/top/'+arg+'/'+q));	
		}
		if (src == 'bbc') {
			$('.audio .results').html('<div class="bigtitle">Top 40 for '+name+'</div>');
			loader.addEventListener(air.Event.COMPLETE, radio.onGetTopBBC);
			loader.load(new air.URLRequest('http://www.bbc.co.uk/radio1/chart/'+q+'/print'));	
		}
		if (src == 'uk') {
			$('.audio .results').html('<div class="bigtitle">Top 100 UK</div>');
			loader.addEventListener(air.Event.COMPLETE, radio.onGetTopUK);
			loader.load(new air.URLRequest('http://www.theofficialcharts.com/singles-chart/'));	
		}
		if (src == 'amc') {
			$('.audio .results').html('<div class="bigtitle">Top 100 for '+name+'</div>');
			loader.addEventListener(air.Event.COMPLETE, radio.onGetTopAMC);
			loader.load(new air.URLRequest('http://www.americasmusiccharts.com/index.cgi?fmt='+q));
			
		}
		
	}
	
	this.onGetTopAMC = function(e) {
		$('.progress').hide();
		var data = $(cleanU(e.target.data));
		var tbl = $(data)[3];
		if (typeof(tbl) == 'undefined') return;
		var i = 0, html = '';
		tbl = $(tbl).find('table')[1];
		$(tbl).children().eq(0).children().each(function() {
			var td = $(this).children();
			if (typeof(td) == 'undefined') return true;
			var singer = cap(lc($(td[2]).text()));
			var song = $(td[4]).text();
			if (singer == 'Artist' || song == 'Song Title') return true;
			i++;
			if (parseInt(singer.length) + parseInt(song.length) > 60) var marq = 'long'; else var marq = '';
			html += "<div class='row top' data-id='"+i+"' data-artist='"+cleanName(singer)+"' data-title='"+cleanName(song)+"' data-original='"+cleanName(tbr(song))+"'> <div class='track "+marq+"'><b>#"+i+" "+singer+"</b> - <span class='title'>"+ song +"</span></div><div class='info'></div></div>";
		});
		$('.audio .results').append(html);
	}
	
	this.onGetTopUK = function(e) {
		$('.progress').hide();
		var data = $(cleanU(e.target.data));
		var i =0, html = '';
		$('#top40 tr',$(data)).each(function() {
			var td = $(this).find('td.info .infoHolder') || '';
			if (td.html() == null) return true;
			var song = cap(lc($(td).find('h4').text()));
			var singer = $(td).html();
			var rsinger = /.*<\/h4>\s*(.*)\s*<br>.*/.exec(singer);
			singer = cap(lc(rsinger[1]));
			if (singer == '' || song == '') return true;
			i++;
			if (parseInt(singer.length) + parseInt(song.length) > 60) var marq = 'long'; else var marq = '';
			html += "<div class='row top' data-id='"+i+"' data-artist='"+cleanName(singer)+"' data-title='"+cleanName(song)+"' data-original='"+cleanName(tbr(song))+"'> <div class='track "+marq+"'><b>#"+i+" "+singer+"</b> - <span class='title'>"+ song +"</span></div><div class='info'></div></div>";
		});
		$('.audio .results').append(html);
	}
	
	this.onGetTopBBC = function(e) {
		$('.progress').hide();
		var data = cleanU(e.target.data);
		var tbl = $(data)[1];
		if (typeof(tbl) == 'undefined') return;
		var i = 0, html = '';
		$(tbl).find('tr').each(function() {
			var singer = $(this).find('td')[4];
			var song = $(this).find('td')[5];
			if ($(this).find('td')[4] == undefined) return true;
			singer = $(singer).text();
			song = $(song).text();
			i++;
			if (parseInt(singer.length) + parseInt(song.length) > 60) var marq = 'long'; else var marq = '';
			html += "<div class='row top' data-id='"+i+"' data-artist='"+cleanName(singer)+"' data-title='"+cleanName(song)+"' data-original='"+cleanName(song.replace(/\(.*\)/g,''))+"'> <div class='track "+marq+"'><b>#"+i+" "+singer+"</b> - <span class='title'>"+ song +"</span></div><div class='info'></div></div>";
		});
		$('.audio .results').append(html);
	}

	this.onGetTopProsto = function(e) {
		$('.progress').hide();
		var data = cleanU(e.target.data);
		var res = $('#search-results li',$(data));
		if (typeof(res) == 'undefined') return;
		var html = '', i = 0;	
		$(res).each(function(){
			i++;
			var singer = $(this).attr('singer');
			var song = $(this).attr('song');
			if (parseInt(singer.length) + parseInt(song.length) > 60) var marq = 'long'; else var marq = ''; 
			html += "<div class='row top' data-id='"+i+"' data-artist='"+cleanName(singer)+"' data-title='"+cleanName(song)+"' data-original='"+cleanName(song.replace(/\(.*\)/g,''))+"'> <div class='track "+marq+"'><b>#"+i+" "+singer+"</b> - <span class='title'>"+ song +"</span></div><div class='info'></div></div>";
		});
		$('.audio .results').append(html);
	}
	

}
var radio = new Radio();
