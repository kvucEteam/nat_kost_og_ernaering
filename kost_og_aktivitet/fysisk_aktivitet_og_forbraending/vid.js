var runde = 0;
var spm_taeller = 0;
var score = 0;
var total_spm = 0;
var playing = false;
var player;
var playtime;
var xmlData;

var hojde;
var bredde;
var videoId;
var popudwidth;
var popud_left;

var m = 0;

var kalorier = 0;

var timestamp_Array = new Array();
var kj_Array = new Array();
var kjFaktor_Array = new Array();

$.ajax({

	type : "GET",
	url : "vid.xml",
	dataType : "xml",
	success : function(xml) {
		xmlData = xml;
		var tal = 1;
		var data = $(xmlData);
		hojde = data.find('video').attr('hojde');
		bredde = data.find('video').attr('bredde');
		videoId = data.find('video').attr('videoId');
		var lengde = data.find('runde').length;
		popudwidth = 620;
		popud_left = (bredde / 2) - (popudwidth / 2);
		//alert("pul" + popud_left);
		for(var i = 0; i < lengde; i++) {
			timestamp_Array.push(data.find('runde').eq(i).attr('timestamp'));
			kj_Array.push(data.find('runde').eq(i).attr('kj'));

			if(i == 0) {
				var timeStampPrev = -1;
			} else {
				timeStampPrev = timestamp_Array[i - 1];
			}
			//	alert(timeStampPrev);
			var kjFaktor = kj_Array[i] / ((timestamp_Array[i] - 1) - timeStampPrev);
			kjFaktor_Array.push(kjFaktor);
			//alert(kjFaktor_Array[i]);
			//alert ("sec:" + (timestamp_Array[i] - timeStampPrev) + "kj: " + kj_Array[i]);

		}
		setUpTube();

	},
	error : function() {
		alert("error loading xml");
	}
});

//Skriv højde og bredde på den youtube film du amvender:

//bredde på popud'en

///

//

//Tilføjer ny højde og bredde ift youtube filmen:

/// PLAYER SCRIPT
function setUpTube() {
	//alert("sut");
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.

function onYouTubeIframeAPIReady() {
	//alert(videoId);
	$("#overlay").toggle();
	player = new YT.Player('player', {
		height : hojde,
		width : bredde,
		videoId : videoId,
		playerVars : {
			'id' : 'ytPlayer',
			'enablejsapi' : 1,
			'allowScriptAccess' : 'always',
			'version' : 3,
			'controls' : 0,
			'showinfo' : 0,
			'modestbranding' : 1,
			wmode : 'transparent',
			allowFullScreen : false

		},
		events : {
			'onStateChange' : function(event) {

				if(event.data == YT.PlayerState.PLAYING) {
					playing = true;
					////////alert ("pølse");
				}
				else {
					playing = false;
					////////alert ("pølse");
				}
				//	var hallo = player.getCurrentTime();
				////////alert(hallo);
			},
			'onReady' : function(event) {
				//alert("ready");
				var interval = setInterval(function() {

					var playTime = Math.round(player.getCurrentTime());
					//console.log(playTime);

					var s = playTime - (m * 60);

					if(playTime > 115) {
						//alert ("hussa");
						player.pauseVideo();
						//playing == false;
						//$(".popud").toggle();
						if(playing == true) {
							$("#overlay").fadeToggle();
							playing = false;
						}
						if(kalorier > 0) {
							$(".popud").html("<h3>Natten er forbi.<br/> Du har på 1 døgn opnået en POSITIV energibalance. Hvis du fortsætter med at spise mere end du har forbrændt, vil du begynde at tage på.<br/></h3><h3 class = 'forfra'><a>Klik for at starte en ny dag.<a/> </h3>");
						} else {
							$(".popud").html("<h3 class = 'forfra'>Natten er forbi.<br/> Du har på 1 døgn opnået en NEGATIV energibalance. Hvis du fortsætter med at forbrænde mere end du har spist, vil du begynde at tabe dig.<br/>  <h3 class = 'forfra'><a> Klik for at starte en ny dag.<a/> </h3>");
						}
						$(".popud").css("cursor", "pointer");
						$("#overlay").click(function() {
							//alert("ost");
							location.reload();
						});
					}
					if(s > 59) {
						m++;
					}

					var dec_s = s;
					if(dec_s < 10) {
						dec_s = "0" + dec_s;
					}

					if(playing == true) {
						console.log("tæller" + kjFaktor_Array[runde] + " kj ned pr sek");
						if(runde < 50) {
							kalorier = Math.round(kalorier - kjFaktor_Array[runde]);
						} else {
							//kalorier = Math.round(kalorier - kjFaktor_Array[runde]);
							kalorier = Math.round(kalorier - 0);
						}
						$('#kalorier').html(kalorier + " kJ");
						$('#time').html(m + ":" + dec_s + " / 2:00  [Næste valg om <b>" + ((timestamp_Array[runde] - playTime) - 1) + "</b> sekunder]");
					} else {
						$('#time').html(m + ":" + dec_s + " / 2:00");

					}
					//console.log(playTime + "," + timestamp_Array[runde] + ", " + player.getPlaybackRate());
					if(playTime > timestamp_Array[runde] - 2 && playing == true) {
						playing == false;

						poseQuestion();
					}

				}, 1000)
			}
		}
	});
	$("#overlay").css("height", hojde);
	$("#overlay").css("width", bredde);
	$(".popud").css("width", popudwidth);
	$(".popud").css("left", popud_left);
}

// 4. The API will call this function when the video player is ready.

function poseQuestion() {

	//////alert("kør den auf!");
	player.pauseVideo();

	init(runde, spm_taeller);

}

function resumeVideo() {
	player.playVideo();
}

function init(tal, taeller) {

	//alert("runde:" + tal + "spm_taeller" + taeller );

	if(spm_taeller == 0) {
		$("#overlay").fadeToggle();
	}
	$('.popud').animate({
		top : -400,
	}, 0, function() {
		$('.popud').animate({
			top : 80,
		}, 550, function() {
			// Animation complete.
		});
	});
	var data = $(xmlData);

	var akt_runde = data.find('runde').eq(tal);

	var spm = akt_runde.find('spm').eq(taeller);

	var spm_length = akt_runde.find('spm').length;

	var tekst = spm.attr('tekst');

	var bol = spm.attr('korrekt');

	//alert ("bol:" + bol)

	var svar_length = spm.find('svar').length;

	var svar = spm.find('svar');

	var options_text = "";

	//var popud_height = 130 + (svar_length * 30);
	//alert (popud_height);

	//$(".popud").css("height", popud_height);
	if(svar_length > 1) {

		for(var i = 0; i < svar_length; i++) {
			//alert (svar.eq(i).attr('kal'));
			//alert(svar.eq(i).attr('pic'));
			options_text = options_text + "<td id ='" + i + "'><img src='img/" + svar.eq(i).attr('pic') + "'><br/><span class='imgspan' >" + svar.eq(i).attr("overskrift") + "</span><br/><p class='byline'>" + svar.eq(i).attr("uddtekst") + "</p></td>";
		}
		//$("#runde").html("<h4>Quizrunde " + (runde + 1) + ", spørgsmål " + (spm_taeller + 1) + " af " + spm_length + "<br/>Din score: " + score + "</h4>");

		$(".popud").html("<h4> Hvad vælger du...  </h4><hr><h3>" + tekst + "</h3><table><tr>" + options_text + "</tr></table>");
		$("img").hover(function() {
			//$(this).attr("src", "img/valgt.png");
		}, function() {
			//$(this).attr("src", "img/i_valgt.png");
		});
	} else {
		$(".popud").html("<h3>Dagen er slut. <br/><br/> Dit kalorieregnskab for dagen blev " + kalorier + " kJ. <br/>Når man sover bruger man ca. 270 kJ i timen. <br/><br/><table><th><td class = 'ny' id ='" + 0 + "'>" + svar.eq(0).attr("overskrift") + "</td></th></table></h3>");

	}
	$("td").click(function() {
		//alert("kalorier" + kalorier);

		$("td").unbind('click');
		total_spm++;
		var valgt = $(this).attr("id");
		var num = parseInt(valgt);
		var kal_change = parseInt(svar.eq(num).attr('kal'))

		//alert("svar" + svar.eq(num).attr('kal'));
		kalorier = kalorier + kal_change;

		if(kal_change > 0) {
			$("#scoreUp").html("+" + kal_change + " kJ");
			var retning = "-=75";
		} else {
			$("#scoreUp").html(" " + kal_change + " kJ");
			var retning = "+=75";
		}
		$("#kalorier").html(kalorier + " kJ");
		$(".imgspan").eq(num).css("color", "#ff0080");
		//html(kalorier + " kJ");
		$("img").eq(num).css("color", "#ff0080");
		//html(kalorier + " kJ");

		$("#scoreUp").animate({
			opacity : 0.6,
			top : retning
		}, 3000, function() {
			$("#scoreUp").css("opacity", 1).css("top", 440 + "px").html("");

		});
		//$("img").eq(valgt).attr("src", "img/valgt.png");

		$("img").unbind('mouseenter mouseleave');

		if(valgt == bol) {
			score++;
			//$("#runde").html("<h4>Quizrunde " + (runde + 1) + ", spørgsmål " + (spm_taeller + 1) + " af " + spm_length + "<br/>Din score: " + score + "</h4>");

		} else {

		}
		$("td").each(function() {
			if($(this).attr("id") == bol) {
				$(this).css("color", "#4b865c");
			} else {
				$(this).css("color", "#ef5b5b");
			}
		});
		spm_taeller++;

		if(spm_taeller < spm_length) {
			setTimeout(function() {
				init(runde, spm_taeller);
			}, 3000);
		} else {
			if(tal > timestamp_Array.length - 2) {

				$('#overlay').delay(1500).fadeToggle('slow', function() {
					//alert("fjern overlay");
					resumeVideo();
					spm_taeller = 0;
					runde = 2000;
				});
			} else {
				$('#overlay').delay(1500).fadeToggle('slow', function() {
					//alert("fjern overlay");
					resumeVideo();
					spm_taeller = 0;
					runde++;
				});
			}
		}
	});
}

function slutFeedback() {
	//alert("slut");
	player.pauseVideo();

	$('#overlay').delay(5000).fadeToggle('slow', function() {
		//alert("fjern overlay");
		resumeVideo();
		//spm_taeller = 0;
		//runde++;
	});
}