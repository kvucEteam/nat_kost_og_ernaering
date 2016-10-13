var runde = 0;
var spm_taeller = 0;
var xmlData;

var hojde;
var bredde;
var popudwidth;
var popud_left;
var score = 0;

var korrekt_Array = new Array();
var tekst_Array = new Array();
var valgt_Array = new Array();
var bol_Array = new Array();

function setHeight(htmlHojde) {

	$(".popud").css("height", htmlHojde);
}

function getXML(xmlLink) {

	$.ajax({

		type : "GET",
		url : xmlLink,
		dataType : "xml",
		success : function(xml) {
			xmlData = xml;
			var tal = 1;
			var data = $(xmlData);
			poseQuestion();
		},
		error : function() {
			alert("error loading xml");
		}
	});
}

// 4. The API will call this function when the video player is ready.

function poseQuestion() {
	//////alert("kør den auf!");
	init(runde, spm_taeller);

}

function init(tal, taeller) {

	if(spm_taeller == 0) {
		$("#overlay").fadeToggle();
	}
	$('.popud').animate({
		left : -400,
		opacity : 0,
	}, 0, function() {
		$('.popud').animate({
			left : 0,
			opacity : 1,
		}, 550, function() {
			// Animation complete.
		});
	});
	var data = $(xmlData);

	var akt_runde = data.find('runde').eq(tal);

	var spm = akt_runde.find('spm').eq(taeller);

	var spm_length = akt_runde.find('spm').length;

	var tekst = spm.attr('tekst');

	tekst_Array.push(tekst);

	var bol = spm.eq(tal).attr('korrekt');

	bol_Array.push(bol);

	var svar_length = spm.find('svar').length;

	var svar = spm.find('svar');

	var options_text = "";

	//var popud_height = 130 + (svar_length * 30);
	//alert (popud_height);

	//$(".popud").css("height", popud_height);

	for(var i = 0; i < svar_length; i++) {
		options_text = options_text + "<hr/><table><tr id ='" + i + "'><td><img src='i_valgt.png' class='btn' ></td><td><span class='imgspan'>" + svar.eq(i).attr("value") + "</span></td></tr></table>";

	}
	
	var image = "";
	var forklaring = "";
	
	if (spm.attr('image') != null){
		image = "<img class='quizimg' src='" + spm.attr('image') + "' />";
	}

	if (spm.attr('forklaring') != null){
		forklaring = "<p>" + spm.attr('forklaring') + "</p>";
	}

	$(".popud").html("<hr/><h4>Spørgsmål " + (spm_taeller + 1) + " af " + spm_length + "<br/>Score: " + score + "</h4>" + image + forklaring + "<h3>" + tekst + "</h3><p>" + options_text + "</p><h4>(Grøn farve markerer rigtigt svar. Rød forkert svar)</h4>");

	$("img.btn").hover(function() {
		$(this).attr("src", "valgt.png");
	}, function() {
		$(this).attr("src", "i_valgt.png");
	});

	$("tr").click(function() {
	
		$("tr").unbind('click');
		$(this).css("color", "#123892");
		$(this).css("font-weight", "bold");
		var valgt = $(this).attr("id");
		$("img.btn").eq(valgt).attr("src", "valgt.png");
		valgt_Array.push(svar.eq(valgt).attr("value"));
		//alert (valgt_Array);
	
		$("tr").each(function() {
			if($(this).attr("id") == bol) {
				$(this).css("color", "#597A2E");
			} else {
				$(this).css("color", "#ef5b5b");
			}
		});
		
		if(valgt == bol) {
			score++;
			korrekt_Array.push("rigtigt");
		} else {
			korrekt_Array.push("forkert");
		}
		spm_taeller++;

		if(spm_taeller < spm_length) {
			setTimeout(function() {
				init(runde, spm_taeller);
			}, 3000);
	
		} else {
			
			var slutfeed = "";
			var sluttext = "";
			var pct = score / spm_length * 100;
			
			if (pct  > 66){
			sluttext = "Du har læst og forstået teorien og kan roligt gå videre til caseopgaven! <br>";	
			}else if (pct > 33){
			sluttext = "Du er på rette vej. Men det vil være en god idé at skimme teksten igen og finde de steder, hvor du lavede fejl.<br>";	
			}else {
			sluttext = "Du må læse teksten grundigt igen. Når du har gjort det, kan du tage testen igen.<br>";
			}
			
			var colorfeed = "";
			
			for(var i = 0; i < korrekt_Array.length; i++) {
				
				if(korrekt_Array[i] == "rigtigt") {
					colorfeed = "#597A2E";
				} else {
					colorfeed = "#ef5b5b";
				}

				slutfeed = slutfeed + "<h4>Spørgsmål " + (i + 1) + ": '" + tekst_Array[i] + "'</h4><p style ='color:"+ colorfeed+"'>" + valgt_Array[i] + " (Du svarede " + korrekt_Array[i] + ")</p>";
			}

			$(".popud").html("<h3>" + sluttext +"</h3>" + slutfeed + "<button type='button' id='btn_again'>Prøv igen</button>");
			//</h3> <br> <h4> Spørgsmål " + (spm_taeller + 1) + " af " + spm_length + "<br/>Score: " + score + "</h4>");
			$("#btn_again").click(function() {

				window.location.reload();
			});
		}
	});
}


//var xmlStreng = $('#xmlStreng').text();