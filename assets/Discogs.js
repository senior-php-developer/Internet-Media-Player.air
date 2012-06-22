function Discogs() {
	var key = "8f3bcd55fe";
	var uid = 0;
	
	this.getArtist = function(q) {
		$('.progress').show();
		if (q == '') return;
		q = encURI(q);
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, disc.onGetArtist);
		loader.load(new air.URLRequest('http://imp.airy.me/discogs.php?act=artist&art='+q));
	}
	
	this.onGetArtist = function(e) {
		$('.progress').hide();
		var result = $.xml2json(e.target.data);
		if (typeof(result.error) != 'undefined') {
			$('.audio .results').html('<div class="bigtitle">Not Found</div>');
			$('.progress').hide();
			return;
		}
		$('.audio .results').html('<div class="bigtitle">'+result.artist.name+'</div>');
		var results = [];
		$(result.artist.releases.release).each(function(){
			var html= '<div class="row artist" data-id="'+this.id+'" data-artist="'+result.artist.name+'" data-title="'+this.title+'"><b>'+this.title+'</b> ('+this.year+') <br><em>'+this.label+' ['+this.format+']</em></div>';
			results.push({year: this.year, html: html});
		});
		results.sort(sortYear);
		var html = "";
		for(key in results) {
			html += results[key].html
		}
		$('.audio .results').html(html);
	}
	
	this.getLabel = function(q) {
		$('.progress').show();
		if (q == '') return;
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, disc.onGetLabel);
		loader.load(new air.URLRequest('http://imp.airy.me/discogs.php?act=label&art='+q));
	}
	
	this.onGetLabel = function(e) {
		$('.progress').hide();
		var result = $.xml2json(e.target.data);
		if (typeof(result.error) != 'undefined') {
			$('.audio .results').html('<div class="bigtitle">Not Found</div>');
			$('.progress').hide();
			return;
		}
		var html = '<div class="bigtitle">'+result.label.name+'</div>';
		$(result.label.releases.release).each(function(){
			html+= '<div class="row label" data-id='+this.id+'">'+this.catno+' <b>'+this.artist+'</b> - '+this.title+'  ['+this.format+']</div>';
		});
		$('.audio .results').html(html);
	}
	
	this.getRelease = function(e) {
		$('.progress').show();
		uid = 0;
		var id = $(this).attr('data-id');
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE, disc.onGetRelease);
		loader.load(new air.URLRequest('http://imp.airy.me/discogs.php?act=release&art='+id));
	}
	
	this.onGetRelease = function(e) {
		$('.progress').hide();
		var result = $.xml2json(e.target.data);
		if (typeof(result.error) != 'undefined') {
			$('.audio .results').html('<div class="bigtitle">Not Found</div>');
			$('.progress').hide();
			return;
		}
		var html = '<div class="smalltitle">';
		var artist = '';
		$(result.release.artists.artist).each(function(k, v){
			artist+= this.name;
			if (typeof(this.join) != 'undefined')
				artist += ' '+this.join+' ';
		});
		html += artist+' - '+result.release.title+'</div>';
		$(result.release.tracklist.track).each(function(k, v){
			uid++;	
			if (typeof(this.artists) != 'undefined') {
				var art = '';
				$(this.artists.artist).each(function(){
					art += this.name;
					if (typeof(this.join) != 'undefined')
						art += ' '+this.join+' ';
				});	
				artist = art;
			}
			var clean = cleanName(this.title.replace(/\(.*\)/g,""));
			if (this.title.length > 70) this.title = this.title.substr(0,70);
			html += '<div class="row release" data-id="'+uid+'" data-artist="'+cleanName(artist.replace(/\(.*\)/g,""))+'"  data-title="'+clean+'"><div class="track"><b>'+artist.replace(/\(.*\)/g,"")+'</b> - <span class="title">'+this.title+'</span></div><div class="info"></div></div>'
		});
		$('.audio .results').html(html);
	}
}

var disc = new Discogs();