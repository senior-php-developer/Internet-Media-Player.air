function onLoad() {
	doLogin();
	menu.create();
	sloader.addEventListener(air.Event.COMPLETE, videoLoaded);
	
	/* jPlayer */
	var jpPlayTime = $("#jplayer_play_time");
	var jpTotalTime = $("#jplayer_total_time");
	jpStop = false;

	$("#jquery_jplayer").jPlayer({volume: 50,	oggSupport: false, swfPath: '/lib/jplayer/'}).jPlayer("onProgressChange", function(loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime, totalBytes) {	
		jpPlayTime.text($.jPlayer.convertTime(playedTime));
		jpTotalTime.text($.jPlayer.convertTime(totalTime));
		if (loadPercent == 0)
			jpStop = false;
		if (!jpStop && (loadPercent == 100)) {
			jpStop = true;
			$('.play-info .track').append(' - '+$.jPlayer.convertTime(totalTime)+' | '+ (totalBytes/(1024*1024)).toFixed(2)+' Mb | ' +((totalBytes*8/1024) / (totalTime/1000)).toFixed(1)+' kbps');
		}
	}).jPlayer("onSoundComplete", function() {
		if ($('.audio .row.active').length > 0)
			$(".row.active").removeClass('active').next().click();
		else
			playlist.getBody().find('.row.active').removeClass('active').next().click();
	});

	$('.jp-controls .jp-next').click(function(){
		if ($('.audio .row.active').length > 0)
			$(".row.active").removeClass('active').next().click();
		else
			playlist.getBody().find('.row.active').removeClass('active').next().click();
	});
	
	$("ul.tabs").tabs("div.panes > div", {effect: 'sld'});
	$(".tabs a, .menu span").click(closeMenus);
		
	$('.audio .query').keydown(function(){
		clearTimeout(menu.livesearch);
		if (event.keyCode == '13')
    	findMusic();
		else if (event.keyCode == '27')
			$('.audio .search .live').hide();
		else
			menu.livesearch = setTimeout(audio.liveSearch, 1000);
	});
	$('.video .query').keydown(function(){
		clearTimeout(menu.livesearch);
		if (event.keyCode == '13')
    	findVideo();
		else if (event.keyCode == '27')
			$('.video .search .live').hide();
		else {
			if (vSrcType == '3')
				menu.livesearch = setTimeout(youtube.liveSearch, 1000);
			else
				menu.livesearch = setTimeout(yandex.liveSearch, 1000);
		}
	});
	
	$('#toolbar').mousedown(function(){
		window.nativeWindow.startMove();
	});
	
	// titlebar buttons
	$('#toolbar .close').click(closeApp);
	$('#toolbar .minimize').click(function(){
		window.nativeWindow.minimize();
	});
	$('#toolbar .shorten').click(function(){
		if (app.short == 0) {
			$('.panes > div').eq(0).animate({height: 48});
			$('.panes > div').not(':eq(0)').animate({height: 0});
			app.short = 1;
		} else {
			$('.panes > div').eq(app.mode-1).animate({height: 560});
			app.short = 0;
		}	
	});
	
	// audio functions
	$('.audio .results .last, .audio .results .top, .audio .results .release').live('click', audio.getFiles);
	$('.audio .results .artist, .audio .results .label').live('click', disc.getRelease);
	$('.audio .results .similar, .audio .results .recent').live('click',function(e){last.getList($(this).find('b').text())});
	$('.audio .results .album').live('click',last.getAlbumTracks);
	$(".audio .results .vk").live('click', audio.playFile);
	$('.audio .search .live div').live('click', audio.liveSearchSelect);
		
	// video functions
	$('.video .results .moar.youtube').live('click', youtube.getMore); 
	$('.video .results .moar.rel').live('click', youtube.getMoreRelated); 
	$('.video .results .moar.vkadre').live('click', video.getMore); 
	$(".video .vk").live('click', video.loadVideo);
	$(".video .results .yt, .video .results .rut").live('click', video.openVideo);
	$('.video .results .moar.rutube').live('click', rutube.getMore); 
	$('.video .results .el.ya').live('click', yandex.getLink);
	$('.video .results .moar.ya').live('click', yandex.getMore);
	$('.video .search .live div').live('click', yandex.liveSearchSelect);
	
	// trigger timeout for closing popup when mouseout
	$('.audio .categories, .video .categories').mouseout(function(){menu.closecats = setTimeout(closeCats, 400)});
	$('.audio .categories, .video .categories').mouseover(function(){clearTimeout(menu.closecats)});
	$('.audio .radio-top').mouseout(function(){menu.closetop = setTimeout(closeTop, 400)});
	$('.audio .radio-top').mouseover(function(){clearTimeout(menu.closetop)});
	$('.audio .live, .video .live').mouseout(function(){menu.closelive = setTimeout(closeLive, 800)});
	$('.audio .live, .video .live').mouseover(function(){clearTimeout(menu.closelive)});
	// select from drop down lists
	$('.audio .categories a').click(audio.selectCat);
	$('.video .categories a').click(video.selectCat);
	$('.audio .radio-top a').click(radio.getTop);
		
	$('#wrap').removeClass('hide');	
}