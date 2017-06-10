/*jslint browser: true*/
/*global $,jsPDF,html2pdf*/

//-----------------------------------------------------------------------

var gOpenIssues = [];
var gClosedIssues = [];
var gUser = false;

//-----------------------------------------------------------------------

function activateTab(tab) {
	'use strict';

	$('.nav-tabs a[href="' + tab + '"]').tab('show');
	$('.nav').find('.active').removeClass('active');
	$('.nav a[href="' + tab + '"]').parent().addClass('active');
}

//-----------------------------------------------------------------------

$('.navbar-nav > li').click(function (event) {
	'use strict';

	event.preventDefault();
	var target = $(this).find('>a').prop('hash');

	activateTab(target);
});

//-----------------------------------------------------------------------

$('#buttonGo').click(function (event) {
	'use strict';

	if (gUser) {
		activateTab('#birth');
	} else {
		activateTab('#login');
	}
});

//-----------------------------------------------------------------------

$('.buttonSocialMedia').click(function (event) {
	'use strict';

	$('.navbar-right li:nth-child(1)').css('display', 'none');
	$('.navbar-right li:nth-child(2)').css('display', 'block');
	gUser = true;

	activateTab('#city');
});

//-----------------------------------------------------------------------

$('#buttonCity').click(function (event) {
	'use strict';

	activateTab('#birth');
});

//-----------------------------------------------------------------------

function finishIssue(id) {
	'use strict';

	var i, j, sum = 0, listOfficePaper = '', listOfficeDocs = '', listMail = '';

	for (i = 0; i < gOpenIssues.length; ++i) {
		if (gOpenIssues[i].id === id) {
			if ('claim' === gOpenIssues[i].type) {
				gOpenIssues[i].type = 'edit';
			} else if ('paper' === gOpenIssues[i].type) {
				gOpenIssues[i].type = 'exists';
			} else if ('optional' === gOpenIssues[i].type) {
				gOpenIssues[i].type = 'not';
			}
			gClosedIssues.push(gOpenIssues[i]);
			gOpenIssues.splice(i, 1);

			gClosedIssues.sort(function (a, b) {
				var order = ['edit', 'exists', 'not'];

				if (order.indexOf(a.type) === order.indexOf(b.type)) {
					return a.title > b.title ? 1 : -1;
				}

				return order.indexOf(a.type) > order.indexOf(b.type) ? 1 : -1;
			});

			for (j = 0; j < gClosedIssues.length; ++j) {
				if ((gClosedIssues[j].price > 0) && ('not' !== gClosedIssues[j].type) && ('exists' !== gClosedIssues[j].type)) {
					sum += gClosedIssues[j].price;
				}
				if ('edit' === gClosedIssues[j].type) {
					if ('mail' === gClosedIssues[j].transaction) {
						listMail += '<li>' + gClosedIssues[j].title + '</li>';
					} else {
						listOfficeDocs += '<li>' + gClosedIssues[j].title + '</li>';
					}
				} else if ('exists' === gClosedIssues[j].type) {
					listOfficePaper += '<li>' + gClosedIssues[j].title + '</li>';
				}
			}

			$('a[href="#openIssues"] .badge').html(gOpenIssues.length === 0 ? '' : gOpenIssues.length);
			$('a[href="#closedIssues"] .badge').html(gClosedIssues.length);
			$('#finalMail').html(listMail);
			$('#finalOfficeDocs').html(listOfficeDocs);
			$('#finalOfficePaper').html(listOfficePaper);
			$('#finalSum').html(parseInt(sum, 10) + ',' + (sum * 100).toString().substr(-2));

			if (listMail.length > 0) {
				$('#finalMail').parent().find('button').removeClass('disabled');
			}

			prepareOpenIssues();
			return;
		}
	}
}

//-----------------------------------------------------------------------

function pdfanzeigeerklaerungvorfamilienname() {
	'use strict';

	activateTab('#pagepdf');

	var doc = new jsPDF(),
		html = '';

	doc.setFont('times');
	doc.setFontType('bold');
	doc.setFontSize(12);
	doc.text(20, 20, 'Bestimmung zur Namensführung des Kindes (Bitte unbedingt ausfüllen)');

	doc.setFontType('normal');
	doc.setFontSize(11);
	doc.text(20, 30, 'Der Familienname eines Kindes richtet sich grundsätzlich nach dem Heimatrecht des Kindes (Art. 10 Abs. 1');
	doc.text(20, 35, 'EGBGB). Das Kind kann auch den Namen nach dem Recht eines Staates erhalten, dem ein Elternteil');
	doc.text(20, 40, 'angehört; nach deutschem Recht, wenn ein Elternteil seinen gewöhnlichen Aufenthalt im Inland hat (Art. 10');
	doc.text(20, 45, 'Abs. 3 Nr. 1 bzw. Nr. 2 EGBGB). Die Rechtswahl wird ausschließlich vom Inhaber/von der Inhaberin der');
	doc.text(20, 50, 'elterlichen Sorge getroffen.');

	doc.text(20, 60, 'Bei der Anwendung deutschen Rechts sind die Bestimmungen der §§ 1616 ff. BGB maßgebend (nähere');
	doc.text(20, 65, 'Auskünfte werden vom zuständigen Standesamt erteilt). Die Bindungswirkung des Familiennamens');
	doc.text(20, 70, 'vorgeborener Kinder ist hierbei zu beachten.');

	doc.setFontType('bold');
	doc.setFontSize(18);
	doc.text(20, 80, 'A');

	doc.setFontType('normal');
	doc.setFontSize(11);
	doc.text(27, 80, 'Als Inhaber der elterlichen Sorge*)');
	doc.text(27, 90, 'bestimme ich/bestimmen wir für unsere/unseren am ..................................... geborene Tochter/');
	doc.text(27, 95, 'geborenen Sohn den/dieVornamen');
	doc.text(27, 105, '...............................................................................................................................................');

	doc.setFont('courier');
	doc.setFontSize(14);
	doc.text(107, 90 - 1, '10. Juni 2017');
	doc.text(146, 90 - 0, '---------');
	doc.text(30, 105 - 1, 'Julian');

	var str = doc.output('datauristring');
	$('#pdfPreview').attr('src', str);

	html += '<div>B Ferner wähle ich/wählen wir für den Namen des Kindes deutsches Recht</div>';
	html += '<div>Wir führen einen gemeinsamen Ehenamen. Dieser wird Geburtsname des Kindes.</div>';
	html += '<div>Wir führen keinen gemeinsamen Namen.</div>';
	html += '<div>Daher bestimmen wir gemäß § 1617 BGB den Familiennamen</div>';
	html += '<div>des Vaters der Mutter zum Geburtsnamen des Kindes.</div>';
	html += '<div>Uns ist bekannt, daß diese Namensbestimmung auch für unsere weiteren gemeinsamen Kinder gilt.</div>';
	html += '<div>C In Anwendung ausländischen Rechts wähle ich/wählen wir für den Namen des Kindes das Recht des Staates ..........................................................</div>';
	html += '<div>Nach dem oben genannten Recht bestimme ich/bestimmen wir folgenden Familiennamen für das Kind:</div>';
	html += '<div>.................................................................................................................................................</div>';
	html += '<div>Die für das Kind hier vorgenommene Erteilung von Vornamen ist richtig und vollständig und entspricht auch hinsichtlich der Schreibweise meinem/unserem ausdrücklichen Willen. Mir/Uns ist bekannt, dass nach der Beurkundung durch den Standesbeamten grundsätzlich keine Änderungen mehr möglich sind.</div>';
	html += '<div>*)Bei nicht miteinander verheirateten Eltern sind Nachweise über die gemeinsame elterliche Sorge und die Anerkennung der Vaterschaft beizufügen, gegebenenfalls vorzulegen</div>';
	html += '<div>         Berlin, den ................................................</div>';
	html += '<div>........................................................................... (Mutter)</div>';
	html += '<div>Berlin, den ............................................</div>';
	html += '<div>....................................................................... (V ater)</div>';

//	html2pdf(html, doc, function (pdf) {
//		var str = pdf.output('bloburi');
//		var str = pdf.output('datauristring');
//		$('#pdfPreview').attr('src', str);
//	});
}

//-----------------------------------------------------------------------

function onListItem() {
//	'use strict';

	var id = $(this).data('id'),
		type = $(this).data('type'),
		i;

	if ('done' === type) {
		finishIssue(id);
	} else if ('edit' === type) {
		activateTab('#page' + id);
	} else if ('pdf' === type) {
		pdfanzeigeerklaerungvorfamilienname();
	}
}

//-----------------------------------------------------------------------

function prepareOneIssues(issue) {
	'use strict';

	var str = '';

	str += '<div class="col-sm-6 col-md-4">';
	str += '<div class="thumbnail">';
	str += '<div class="alert alert-info" style="text-align:center;padding:.2em;margin:0;">';
	str += '<img style="height: 200px;" src="assets/' + issue.id + '.jpg" data-holder-rendered="true">';
	str += '</div>';
	str += '<div class="caption" style="position:relative;">';
	str += '<h3>' + issue.title + '</h3>';
	str += '<p style="min-height:3em;">' + issue.comment + '</p>';

	if ((issue.price > 0) && ('not' !== issue.type) && ('exists' !== issue.type)) {
		str += '<span class="label label-danger" style="font-size:2em;transform:rotate(12deg);position:absolute;top:-.5em;right:0;">' + parseInt(issue.price, 10) + ',' + (issue.price * 100).toString().substr(-2) + ' €</span>';
	}

	str += '<p style="text-align:center;">';

	if ('claim' === issue.type) {
		str += '<a href="#" class="btn btn-primary" role="button" data-type="edit" data-id="' + issue.id + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Ausfüllen</a>';
	} else if ('paper' === issue.type) {
		str += '<a href="#" class="btn btn-success" role="button" data-type="done" data-id="' + issue.id + '"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Vorhanden</a>';
		str += '&nbsp;&nbsp;';
		str += '<a href="#" class="btn btn-primary" role="button" data-type="edit" data-id="' + issue.id + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Beantragen</a>';
	} else if ('optional' === issue.type) {
		str += '<a href="#" class="btn btn-warning" role="button" data-type="done" data-id="' + issue.id + '"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Nein danke</a>';
		str += '&nbsp;&nbsp;';
		str += '<a href="#" class="btn btn-primary" role="button" data-type="edit" data-id="' + issue.id + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Beantragen</a>';
	} else if ('exists' === issue.type) {
		str += '<a href="#" class="btn btn-default disabled" role="button" data-type="done" data-id="' + issue.id + '"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Vorhanden</a>';
	} else if ('edit' === issue.type) {
		str += '<a href="#" class="btn btn-primary" role="button" data-type="edit" data-id="' + issue.id + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Bearbeiten</a>';
		str += '&nbsp;&nbsp;';
		str += '<a href="#" class="btn btn-success" role="button" data-type="pdf" data-id="' + issue.id + '"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> Vorschau</a>';
	} else if ('not' === issue.type) {
		str += '<a href="#" class="btn btn-default disabled" role="button" data-type="done" data-id="' + issue.id + '"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Nein danke</a>';
	}

	str += '</p>';
	str += '</div>';
	str += '</div>';
	str += '</div>';

	return str;
}

//-----------------------------------------------------------------------

function prepareOpenIssues() {
	'use strict';

	var str = '', i;

	if (gOpenIssues.length === 0) {
		$('#openIssues h1').html('Gut vorbereitet');
		$('#openIssues .panel-body p').html('Alle Formulare sind ausgefüllt.<br><br>' +
			'<a href="#" class="btn btn-primary" id="goToList" role="button">Zeige mir die Liste <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></a>');
	} else {
		$('#openIssues h1').html('Es gibt noch etwas zu tun');
		$('#openIssues .panel-body p').html('Schaue dir die Liste an und bereite folgende Dokument vor:');

		for (i = 0; i < gOpenIssues.length; ++i) {
			str += prepareOneIssues(gOpenIssues[i]);
		}
	}

	$('#openIssues .panel-body .row').html(str);
	$('#openIssues .panel-body .row a').click(onListItem);
	$('#openIssues .panel-body #goToList').click(function () {
		prepareClosedIssues();
		activateTab('#closedIssues');
	});
}

//-----------------------------------------------------------------------

function prepareClosedIssues() {
	'use strict';

	var str = '', i, optional = 0;

	if (gClosedIssues.length === 0) {
		$('#closedIssues h1').html('Los geht\'s');
		$('#closedIssues .panel-body p').html('Fülle alle Formulare aus.<br><br>' +
			'<a href="#" class="btn btn-primary" id="goToList" role="button">Zeige mir die Liste <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></a>');
	} else {
		for (i = 0; i < gOpenIssues.length; ++i) {
			if ('optional' === gOpenIssues[i].type) {
				++optional;
			}
		}

		if ((gOpenIssues.length - optional) === 0) {
			$('#closedIssues h1').html('Super, du bist fertig');
			$('#closedIssues .panel-body p').html('Du hast alle Formulare ausgefüllt. Es ist Zeit für den letzten Schritt.<br><br>' +
												  '<a href="#" class="btn btn-success" id="goToFinal" role="button">Formulare verschicken <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></a>' +
												  '<br><br>');
		} else {
			$('#closedIssues h1').html('Du hast schon viel erledigt');
			$('#closedIssues .panel-body p').html('Diese Dokumente hast du vorbereitet und sind fertig:');
		}

		for (i = 0; i < gClosedIssues.length; ++i) {
			str += prepareOneIssues(gClosedIssues[i]);
		}
	}

	$('#closedIssues .panel-body .row').html(str);
	$('#closedIssues .panel-body .row a').click(onListItem);
	$('#closedIssues .panel-body #goToList').click(function () {
		prepareOpenIssues();
		activateTab('#openIssues');
	});
	$('#closedIssues .panel-body #goToFinal').click(function () {
		activateTab('#sendIssues');
	});
}

//-----------------------------------------------------------------------

function pushIssue(id, title, comment, type, price, transaction) {
	'use strict';

	var i = 0;
	for (i = 0; i < gOpenIssues.length; ++i) {
		if (gOpenIssues[i].id === id) {
			return;
		}
	}
	for (i = 0; i < gClosedIssues.length; ++i) {
		if (gClosedIssues[i].id === id) {
			return;
		}
	}

	gOpenIssues.push({
		id: id,
		title: title,
		comment: comment,
		type: type,
		price: price,
		transaction: transaction
	});

	gOpenIssues.sort(function (a, b) {
		var order = ['claim', 'paper', 'optional'];

		if (order.indexOf(a.type) === order.indexOf(b.type)) {
			return a.title > b.title ? 1 : -1;
		}

		return order.indexOf(a.type) > order.indexOf(b.type) ? 1 : -1;
	});

	$('a[href="#openIssues"] .badge').html(gOpenIssues.length);
}

//-----------------------------------------------------------------------

$('a[href="#openIssues"]').on('shown.bs.tab', function (e) {
	'use strict';

	prepareOpenIssues();
});

//-----------------------------------------------------------------------

$('a[href="#closedIssues"]').on('shown.bs.tab', function (e) {
	'use strict';

	prepareClosedIssues();
});

//-----------------------------------------------------------------------

function pushDefaultDocs() {
	'use strict';

	pushIssue('geburtsurkundeerstbeurkundung', 'Geburtsurkunde beantragen', 'Die Geburtsurkunde für das Baby', 'claim', 10, 'office');
	pushIssue('personalausweismann', 'Personalausweis des Vaters', '... oder der Reisepass muss vorhanden sein', 'paper', 28.80, 'office');
	pushIssue('personalausweisfrau', 'Personalausweis der Mutter', '... oder der Reisepass muss vorhanden sein', 'paper', 28.80, 'office');
	pushIssue('geburtsurkundefrau', 'Geburtsurkunde der Mutter', 'Ein Nachweis, wo die Mutter geboren wurde', 'paper', 10, 'office');
	pushIssue('vollmacht', 'Vollmacht', 'Eine andere Person soll die Geburtsurkunde abholen', 'optional', 0, 'office');
	pushIssue('elternzeitmann', 'Elternzeit für den Vater', 'Der Antrag auf Elternzeit für den Arbeitgeber', 'optional', 0, 'mail');
	pushIssue('elternzeitfrau', 'Elternzeit für die Mutter', 'Der Antrag auf Elternzeit für den Arbeitgeber', 'optional', 0, 'mail');
	pushIssue('elterngeld', 'Elterngeld', 'Das Elterngeld ersetzt einen Teil ihres Einkommens. Es beträgt zwischen 300 € und 1800 €', 'optional', 0, 'mail');
	pushIssue('wohngeld', 'Wohngeld', 'Wohngeld kann dir angemessenes und familien-gerechtes Wohnen ermöglichen', 'optional', 0, 'mailing');
	pushIssue('erstausstattung', 'Erstausstattung', 'Beihilfe zur Erstausstattung für ihr Baby', 'optional', 0, 'mailing');
}

//-----------------------------------------------------------------------

$('#buttonHospital').click(function (event) {
	'use strict';

	pushDefaultDocs();

	prepareOpenIssues();
	activateTab('#openIssues');
});

//-----------------------------------------------------------------------

$('#buttonHomeBirth').click(function (event) {
	'use strict';

	pushDefaultDocs();
	pushIssue('anzeigeerklaerungvorfamilienname', 'Namenserklärung', 'Welchen Vor- und welchen Nachnamen soll das Baby erhalten', 'claim', -1, 'office');

	prepareOpenIssues();
	activateTab('#openIssues');
});

//-----------------------------------------------------------------------

function canvasDraw(data) {
	'use strict';

	data.ctx.beginPath();
	data.ctx.moveTo(data.prevX, data.prevY);
	data.ctx.lineTo(data.currX, data.currY);
	data.ctx.strokeStyle = '#337ab7';
	data.ctx.lineWidth = 2;
	data.ctx.stroke();
	data.ctx.closePath();
}

//-----------------------------------------------------------------------

function canvasFindXY(res, e, data) {
	'use strict';

	if (res === 'down') {
		data.prevX = data.currX;
		data.prevY = data.currY;
		data.currX = e.layerX - data.canvas.offsetLeft;
		data.currY = e.layerY - data.canvas.offsetTop;

		data.flag = true;
		data.dot_flag = true;
		if (data.dot_flag) {
			data.ctx.beginPath();
			data.ctx.fillStyle = '#337ab7';
			data.ctx.fillRect(data.currX, data.currY, 2, 2);
			data.ctx.closePath();
			data.dot_flag = false;
		}
	}
	if (res === 'up' || res === 'out') {
		data.flag = false;
	}
	if (res === 'move') {
		if (data.flag) {
			data.prevX = data.currX;
			data.prevY = data.currY;
			data.currX = e.layerX - data.canvas.offsetLeft;
			data.currY = e.layerY - data.canvas.offsetTop;
			canvasDraw(data);
		}
	}
}

//-----------------------------------------------------------------------

function initCanvas(id) {
	'use strict';

	var canvas = document.getElementById(id),
		data = {
			canvas: canvas,
			ctx: canvas.getContext('2d'),
			flag: false,
			dot_flag: false,
			prevX: 0,
			currX: 0,
			prevY: 0,
			currY: 0
		};

	data.canvas.addEventListener("mousemove", function (e) {
		canvasFindXY('move', e, data);
	}, false);
	data.canvas.addEventListener("mousedown", function (e) {
		canvasFindXY('down', e, data);
	}, false);
	data.canvas.addEventListener("mouseup", function (e) {
		canvasFindXY('up', e, data);
	}, false);
	data.canvas.addEventListener("mouseout", function (e) {
		canvasFindXY('out', e, data);
	}, false);
}

//-----------------------------------------------------------------------

$('#buttongeburtsurkundeerstbeurkundungInvite').click(function (event) {
	'use strict';

	$('#buttongeburtsurkundeerstbeurkundungInvite').removeClass('btn-primary').addClass('btn-success');
	$('#buttongeburtsurkundeerstbeurkundungInvite span').removeClass('glyphicon-plus').addClass('glyphicon-ok');
});

//-----------------------------------------------------------------------

$('#buttongeburtsurkundeerstbeurkundung').click(function (event) {
	'use strict';

	pushIssue('geburtsurkundemann', 'Geburtsurkunde des Vaters', 'Ein Nachweis, wo der Vater geboren wurde', 'paper', 10, 'office');
	pushIssue('eheurkunde', 'Eheurkunde', 'Die Eheurkunde oder die beglaubigte Abschrift vom Familienbuch der Ehe', 'paper', 10, 'office');

	finishIssue('geburtsurkundeerstbeurkundung');
	activateTab('#openIssues');
});

//-----------------------------------------------------------------------

$('#buttonanzeigeerklaerungvorfamilienname').click(function (event) {
	'use strict';

	finishIssue('anzeigeerklaerungvorfamilienname');
	activateTab('#openIssues');
});

//-----------------------------------------------------------------------

$('#buttonelternzeitfrau').click(function (event) {
	'use strict';

	var i, id = 'elternzeitfrau';
	for (i = 0; i < gOpenIssues.length; ++i) {
		if (gOpenIssues[i].id === id) {
			gOpenIssues[i].type = 'claim';
		}
	}

	finishIssue(id);
	activateTab('#openIssues');
});

//-----------------------------------------------------------------------

$('#buttonelternzeitmann').click(function (event) {
	'use strict';

	var i, id = 'elternzeitmann';
	for (i = 0; i < gOpenIssues.length; ++i) {
		if (gOpenIssues[i].id === id) {
			gOpenIssues[i].type = 'claim';
		}
	}

	finishIssue(id);
	activateTab('#openIssues');
});

//-----------------------------------------------------------------------

$(document).ready(function () {
	'use strict';

	initCanvas('sign1');
	initCanvas('sign2');
	initCanvas('sign3');
	initCanvas('sign4');

	activateTab('#welcome');
	pdfanzeigeerklaerungvorfamilienname();

/*	$('.navbar-right li:nth-child(1)').css('display', 'none');
	$('.navbar-right li:nth-child(2)').css('display', 'block');
	gUser = true;
	activateTab('#baby');*/
});

//-----------------------------------------------------------------------
