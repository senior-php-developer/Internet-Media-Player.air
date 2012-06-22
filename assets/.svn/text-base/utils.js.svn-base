function inArray (needle, haystack) { // (5) strict search in array (found if needle equals to haystack element)
	if (haystack.length == 0) return false;
	for (key in haystack) {
		if (haystack[key].toLowerCase() == needle.toLowerCase())
			return true; 
		}
  return false;
}

function vkArray(dur, arr) {
	if (typeof arr[dur] == 'undefined') return false;
	else return true;
}

function inArray2(txt, arr) {  // (3) lower strict search & for 2+ words: if words differ less than (longest arg / 2), try indexOf both ways 
	if (arr.length == 0) return false;
	txt = txt.toLowerCase();
	var w1 = trim(txt).split(' ');
	for(k in arr) {
		var v = arr[k].toLowerCase(); 
		if (v == txt) return true;
		
		var w2 = trim(arr[k]).split(' ');
		if (w1.length < 2 || w2.length < 2) continue;
		if (abs(w1.length - w2.length)/Math.max(w1.length,w2.length) < 0.5  && (v.indexOf(txt) != -1 || txt.indexOf(v) != -1)) return true;
	}
	return false;
}

function in_array (needle, haystack) { // (4) search of occurencies in array (found if more than 60% of words are equal)
	if (haystack.length == 0) return false;
	needle = lc(needle);
	var w1 = trim(needle).split(' ');
	var postfix = ['club','radio','original'];
	
	for (key in haystack) {
		var v = lc(haystack[key]);
		var w2 = trim(cleanComp(v)).split(' ');
		var f = 0;
		
		//cleanArray(w1, w2); // removes one character words and symbols
		if (nsp(tnum(needle)) == nsp(tnum(v))) return true; // 1 word : equal w/out spaces
		if (w1[0] == w2[0] && (postfix.indexOf(w1[1]) != -1 || postfix.indexOf(w2[1]) != -1)) return true; // 2 words * + postfix
		if (w1.length > 3 && nsp(v).indexOf(nsp(needle)) != -1) return true; //  3+ words  indexOf
		
		if (w1.length == 1 || w2.length == 1) continue; // if needle or haystack element has 1 word - move on
		if (abs(w1.length - w2.length)/w1.length > 0.5) continue; // pass:(word diff / needle length): 1/2 1/3 2/4 2/5 3/6
		
		for(var k in w1) {
			for(var l in w2) {
				if (w1[k].length < 3 && w2[l] == w1[k]) f++;
				if (w1[k].length > 2 && w2[l].length > 2 && (w2[l].indexOf(w1[k]) != -1 || w1[k].indexOf(w2[l]) != -1)) f++;
			}
		} 
		if (f == w1.length-1 && postfix.indexOf(w1[w1.length-1]) != -1) return true;
		if (f/Math.max(w1.length,w2.length) >= 0.55) return true; // pass:(equal words / max words): 2/3 3/4 3/5 4/6 4/7 5/8
	}
  return false;
}

function in_string(str1, str2) { 
	str1 = str1.toLowerCase();
	str2 = str2.toLowerCase();
	if (str1 == str2) return true;
	if (str1.indexOf(str2) || str2.indexOf(str1)) return true;
	
	var w1 = trim(str1).split(' ');
	var w1 = trim(str2).split(' ');
	
	if (array_intersect(w1, w2).length/w1.length > Math.min(w1.length, w2.length)) return true; 
  return false;
}

function rsArray(str, arr) {
	for(k in arr)
		if ($('b',arr[k]).text() == str) return k;
	return -1;
}

function rmArray(dur, arr) {	// checks array of remixes, compare by duration (strict) and title (inArray2)
	if (arr.length == 0) return false;
	for(k in arr) {
		if (arr[k].dur == dur) return true;
	}
	return false;
}

function roArray(dur, arr) {	// checks array of originals, if duration differs by less than 4 seconds - the same! 
	for(k in arr)
		if(abs(arr[k].dur - dur) < 10) return true;
	return false;
}

function sortDur(a, b) {
	return b.dur - a.dur
}

function sortTitle(a, b) {
	if (a.title < b.title) return -1
	else if (a.title > b.title) return 1
	else return 0;	
}

function sortYear(a, b) {
	if (a.year < b.year) return -1
	else if (a.year > b.year) return 1
	else return 0;
}

function cap(str) {
  return str.replace( /(^|\s|\.)(.)/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

// trim whitespaces
function trim(q) {
	return q.replace(/(\s)+/g," ").replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function btrim(str) {
	return trim(str.replace(/\(|\)|\[|\]|\||\.|,|'|"|\-|_|\&|\+/g,' ')).toLowerCase();
}

// trim numbers
function tnum(q) {
	return q.replace(/\d+/g,'');
}

// trim brackets and its content
function tbr(q) {
	return q.replace(/(\(|\[).*(\)|\])?/gi,'');
}

// remove spaces
function nsp(q) {
	return q.replace(/ /g,'').toLowerCase();
}

// lower case
function lc(q) {
	return q.toLowerCase();
}

function cleanU(str) {
	str = str.replace(/[\u0000-\u001f]/g,'').replace(/[\u007f-\u00bf]/g,'');
	str = str.replace(/[\u00c0-\u00c6\u00e0-\u00e6]/g,'a').replace(/[\u00c8-\u00cb\u00e8-\u00eb]/g,'e');
	return str;
}

function cleanArray(w1, w2) {
	for(var k in w1)
		if (w1[k].length == 1 || shit.indexOf(w1[k]) != -1) w1.splice(k,1);
		
	for(var k in w2)
		if (w2[k].length == 1 || shit.indexOf(w2[k]) != -1) w2.splice(k,1);
}

function cleanComp(str) {
	str = str.replace(/\-/g,' ');
	str = str.replace(/&/g,' ');
	return str;
}

var clean = {
	artist: function(q) {
		q = q.replace(/^(A1 |B1 |C1 |D1 |E1 |F1 |G1 |A2 |B2 |C2 |D2 |E2 |F2 |AA |BB )/gi,'');
		return trim(q);
	},
	title: function(q) {
		q = tbr(q);
		q = q.replace(/[\w]+ (remix|mix|rmx|edit).*/gi,''); // remove (this), 1 word before and everything after
		q = q.replace(/( feat| ft\.| vocals by| vip).*/gis,''); // remove (this) and everything after
		q = q.replace(/(full version|remix|remi| mix|rmx| edit)/gi,''); //remove (this)
		q = q.replace(/(mp3|flac|ogg)/gi,'');
		q = q.replace(/^(A1 |B1 |C1 |D1 |E1 |F1 |G1 |A2 |B2 |C2 |D2 |E2 |F2 |AA |BB )/gi,'');
		q = q.replace(/^([0-5][0-9]\s*)+/,'');
		return name(q);
	},
	name: function(q) {
		q = unicode(q);
		var hex = /&#(.+);/.exec(q);
		if (hex != null) q = unescape(q.replace(/&#(.+);/,"%"+dechex(hex[1])));
		q = q.replace(/\[.*\]/g,""); //trim content of square brackets
		q = q.replace(/('|`|’)s/gi,'s').replace(/('|`|’)t/gi,'');  // 's to be s  't to go
		q = q.replace(/(\(|\)|\[|\]|\{|\}|@|:|_|,|'|`|’|\+|\|)+/g,' '); // replace with space
		q = q.replace(/(!|#|%|\^|\*|"|\\|\/|\?|<|>|\.)+/g,''); // remove
		q = q.replace(/(http.?\/\/.*)/gis,'').replace(/club\d+/gi,''); // remove spam
		return trim(q);
	},
	remix: function(q) {
		q = q.replace(/(full version|remix|remi|mix|rmx|edit|vip)/gi,'');
		q = q.replace(/(mp3|flac|ogg)/gi,'');
		q = q.replace(/^([0-5][0-9]\s*)+/,'');
		return name(q);
	},
	unicode: function(q) {
		q = q.replace(/[\u0000-\u001f]/g,'').replace(/[\u007f-\u00bf]/g,'');
		q = q.replace(/[\u00c0-\u00c6\u00e0-\u00e6]/g,'a').replace(/[\u00c8-\u00cb\u00e8-\u00eb]/g,'e');
		return q;
	},
	complete: function(q) {
		q = q.replace(/\-/g,' ');
		q = q.replace(/&/g,' ');
	return q;
	},
	lasturl: function(q) {
		q = encURI(q).replace(/%/g,'%25').replace(/%2520/g,'%20');
		return q;
	},
	lastargs: function(q) {
		var arr = ['!','@','#','$','%','^','&','*','(',')','"',"'",'+','\\','/','-','_'];
		var ar2 = ['!','@','#','\\$','%','\\^','&','\\*','\\(','\\)','"',"'",'\\+','\\\\','/','\\-','_'];
		for(var i in arr) {
			if (q.indexOf(arr[i]))
				q = q.replace(new RegExp(ar2[i],'g'), encodeURIComponent(arr[i]));
		}
		return q;	
	},
	vkurl: function(q) {
		q = decodeURIComponent(q);
		q = q.replace(/(&|\.|\$|\+|:)+/g,' ');
		q = q.replace(/(\?|"|'|@|#)+/g,'');
		return trim(q);
	},
	file: function(q) {
		q = q.replace(/(\\|\/|:|\*|\?|<|>|"|\|)+/g," "); // trim symbols incompatible with windows file system
		return trim(q);
	}
	
}

// returns completely clean title without remixes, edits, feats and track numbers, passes to cleanName then
function cleanTitle(str) {
	str = tbr(str); // remove brackets content
	str = str.replace(/[\w]+ (remix|mix|rmx|edit).*/gi,''); // remove (this), 1 word before and everything after
	str = str.replace(/( feat| ft\.| vocals by| vip).*/gis,''); // remove (this) and everything after
	str = str.replace(/(full version|remix|remi| mix|rmx| edit)/gi,''); //remove (this)
	str = str.replace(/(mp3|flac|ogg)/gi,'');
	str = str.replace(/^(A1 |B1 |C1 |D1 |E1 |F1 |G1 |A2 |B2 |C2 |D2 |E2 |F2 |AA |BB )/gi,'');
	str = str.replace(/^([0-5][0-9]\s*)+/,'');
	return cleanName(str);
}

// removes clean name without unicodes, hex codes, special characters, but with (*) if any
function cleanName(str) {	
	str = cleanU(str);
	var hex = /&#(\d\d);/g.exec(str);
	if (hex != null) str = unescape(str.replace(/&#(.+);/,"%"+dechex(hex[1])));
	str = str.replace(/\[.*\]/g,""); //trim content of square brackets
	str = str.replace(/('|`|’)s/gi,'s').replace(/('|`|’)t/gi,'');
	str = str.replace(/(\(|\)|\[|\]|\{|\}|@|:|_|,|'|`|’|\+|\|)+/g,' '); // replace with space
	str = str.replace(/(!|#|%|\^|\*|"|\\|\/|\?|<|>|\.)+/g,''); // remove
	str = str.replace(/http.*$/gi,'').replace(/club\d+.*$/gi,'').replace(/www.*$/gi,''); // remove spam
	return trim(str);
}

function cleanRemix(str) {
	str = str.replace(/(full version|remix|remi|mix|rmx|edit|vip)/gi,'');
	str = str.replace(/(mp3|flac|ogg)/gi,'');
	str = str.replace(/^([0-5][0-9]\s*)+/,'');
	return cleanName(str);
}

function cleanArtist(str) {
	str = str.replace(/^(A1 |B1 |C1 |D1 |E1 |F1 |G1 |A2 |B2 |C2 |D2 |E2 |F2 |AA |BB )/gi,'');
	return trim(str);
}

// cleaning arguments for VK
function cleanArgsVk(str) {	
	str = decodeURIComponent(str);
	str = str.replace(/(&|\.|\$|\+|:)+/g,' ');
	str = str.replace(/(\?|"|'|@|#)+/g,'');
	return trim(str);
}

function cleanArgsLfm(q) {
	return encURI(q).replace(/%/g,'%25').replace(/%2520/g,'%20');
}

function cleanCharacters(q) {
	var arr = ['!','@','#','$','%','^','&','*','(',')','"',"'",'+','\\','/','-','_'];
	var ar2 = ['!','@','#','\\$','%','\\^','&','\\*','\\(','\\)','"',"'",'\\+','\\\\','/','\\-','_'];
	for(var i in arr) {
		if (q.indexOf(arr[i]))
			q = q.replace(new RegExp(ar2[i],'g'), encodeURIComponent(arr[i]));
	}
	return q;	
}

function cleanFile(str) {
	str = str.replace(/(\\|\/|:|\*|\?|<|>|"|\|)+/g," "); // trim symbols incompatible with windows file system
	return trim(str);
}

function encURI(q) {
	q = encodeURIComponent(q);
	return q;
}

function decURI(q) {
	try {
		q = decodeURIComponent(q);
		return q;
	} catch (error) {
		return '';
	}
}

function short(str, lim) {
	if (str.length > lim) {
		var stop = str.substr(0,lim).lastIndexOf(' ');
		str = str.substring(0,stop);
	}
	return str;	
}

function mkTime(dur) {
	var m = parseInt(dur/60);
	var s = dur % 60;
	var duration = (m > 9 ? m : '0'+m) +':'+ (s > 9 ? s : "0"+s);
	return duration;
}

function sendRequest(options, loader) {
	var params = {};
	for (var k in options)
		params[k] = options[k];
	params.q = cleanArgsVk(params.q);
	params.api_id = '1918220';
	params.v = '3.0';
	params.format = 'JSON';
	params.sig = signature(params);
	params.sid = auth.sid;
	var variables = new air.URLVariables();
	for (var k in params)
		variables[k] = params[k];
	request.url = "http://api.vkontakte.ru/api.php";
	request.data = variables;
	loader.load(request);
}

function signature(params) {
	var keys = new Array();
  for (var k in params)
  	keys.push(k);
  keys.sort();
  var sig = auth.mid;   
  for (var i = 0; i < keys.length; i++)
  	sig = sig + keys[i] + "=" + params[keys[i]];
  sig = sig + auth.secret;
  return md5(sig);
}

function cancelLoad() {
	$('.progress').hide();
}
