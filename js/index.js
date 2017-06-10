/*jslint browser: true*/
/*global $*/

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

	var i;
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

			$('a[href="#openIssues"] .badge').html(gOpenIssues.length);
			$('a[href="#closedIssues"] .badge').html(gClosedIssues.length);

			prepareOpenIssues();
			return;
		}
	}
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
		$('#openIssues h1').html('Es ist noch etwas zu tun');
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

	var str = '', i;

	if (gClosedIssues.length === 0) {
		$('#closedIssues h1').html('Los geht\'s');
		$('#closedIssues .panel-body p').html('Fülle alle Formulare aus.<br><br>' +
			'<a href="#" class="btn btn-primary" id="goToList" role="button">Zeige mir die Liste <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></a>');
	} else {
		if (gOpenIssues.length === 0) {
			$('#closedIssues h1').html('Super, du bist fertig');
			$('#closedIssues .panel-body p').html('Du hast alle Formulare ausgefüllt. Es ist Zeit für den letzten Schritt.<br><br>' +
												  '<a href="#" class="btn btn-success" id="goToFinal" role="button">Alle Formulare zum Amt <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></a>' +
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
}

//-----------------------------------------------------------------------

function pushIssue(id, title, comment, type, price) {
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
		price: price
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

$('#buttonHospital').click(function (event) {
	'use strict';

	pushIssue('geburtsurkundeerstbeurkundung', 'Geburtsurkunde beantragen', 'Die Geburtsurkunde für das Baby', 'claim', 10);
	pushIssue('personalausweismann', 'Personalausweis des Vaters', '... oder der Reisepass muss vorhanden sein', 'paper', 28.80);
	pushIssue('personalausweisfrau', 'Personalausweis der Mutter', '... oder der Reisepass muss vorhanden sein', 'paper', 28.80);
	pushIssue('geburtsurkundefrau', 'Geburtsurkunde der Mutter', 'Ein Nachweis, wo die Mutter geboren wurde', 'paper', 10);
	pushIssue('vollmacht', 'Vollmacht', 'Eine andere Person soll die fertigen Urkunden abholen', 'optional', -1);

	prepareOpenIssues();
	activateTab('#openIssues');
});

//-----------------------------------------------------------------------

$('#buttonHomeBirth').click(function (event) {
	'use strict';

	pushIssue('geburtsurkundeerstbeurkundung', 'Geburtsurkunde beantragen', 'Die Geburtsurkunde für das Baby', 'claim', 10);
	pushIssue('anzeigeerklaerungvorfamilienname', 'Namenserklärung', 'Welchen Vor- und welchen Nachnamen soll das Baby erhalten', 'claim', -1);
	pushIssue('personalausweismann', 'Personalausweis des Vaters', '... oder der Reisepass muss vorhanden sein', 'paper', 28.80);
	pushIssue('personalausweisfrau', 'Personalausweis der Mutter', '... oder der Reisepass muss vorhanden sein', 'paper', 28.80);
	pushIssue('geburtsurkundefrau', 'Geburtsurkunde der Mutter', 'Ein Nachweis, wo die Mutter geboren wurde', 'paper', 10);
	pushIssue('vollmacht', 'Vollmacht', 'Eine andere Person soll die fertigen Urkunden abholen', 'optional', -1);

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

	pushIssue('geburtsurkundemann', 'Geburtsurkunde des Vaters', 'Ein Nachweis, wo der Vater geboren wurde', 'paper', 10);
	pushIssue('eheurkunde', 'Eheurkunde', 'Die Eheurkunde oder die beglaubigte Abschrift vom Familienbuch der Ehe', 'paper', 10);

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

$(document).ready(function () {
	'use strict';

	activateTab('#welcome');

	$('.navbar-right li:nth-child(1)').css('display', 'none');
	$('.navbar-right li:nth-child(2)').css('display', 'block');
	gUser = true;
	activateTab('#birth');

	initCanvas('sign1');
	initCanvas('sign2');
});

//-----------------------------------------------------------------------
