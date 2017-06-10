/*jslint browser: true*/
/*global $*/

//-----------------------------------------------------------------------

var gOpenIssues = [];
var gClosedIssues = [];

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

	activateTab('#login');
});

//-----------------------------------------------------------------------

$('.buttonSocialMedia').click(function (event) {
	'use strict';

	$('.navbar-right li:nth-child(1)').css('display', 'none');
	$('.navbar-right li:nth-child(2)').css('display', 'block');

	activateTab('#city');
});

//-----------------------------------------------------------------------

$('#buttonCity').click(function (event) {
	'use strict';

	activateTab('#birth');
});

//-----------------------------------------------------------------------

function onListItem() {
//	'use strict';

	var id = $(this).data('id'),
		type = $(this).data('type'),
		i;

	if ('done' === type) {
		for (i = 0; i < gOpenIssues.length; ++i) {
			if (gOpenIssues[i].id === id) {
				if ('claim' === gOpenIssues[i].type) {
					gOpenIssues[i].type = 'edit';
				} else if ('paper' === gOpenIssues[i].type) {
					gOpenIssues[i].type = 'exists';
				}
				gClosedIssues.push(gOpenIssues[i]);
				gOpenIssues.splice(i, 1);

				$('a[href="#openIssues"] .badge').html(gOpenIssues.length);
				$('a[href="#closedIssues"] .badge').html(gClosedIssues.length);

				prepareOpenIssues();
				return;
			}
		}
	}
}

//-----------------------------------------------------------------------

function prepareOneIssues(issue) {
	'use strict';

	var str = '';

	str += '<div class="col-sm-6 col-md-4">';
	str += '<div class="thumbnail">';
	str += '<img alt="100%x200" data-src="holder.js/100%x200" style="height: 200px; width: 100%; display: block;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzE5IiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMxOSAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MjAwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTVjOGYwZDkzZmIgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxNnB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNWM4ZjBkOTNmYiI+PHJlY3Qgd2lkdGg9IjMxOSIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMTYuOTY2NjY3MTc1MjkyOTciIHk9IjEwNy41Ij4zMTl4MjAwPC90ZXh0PjwvZz48L2c+PC9zdmc+" data-holder-rendered="true">';
	str += '<div class="caption">';
	str += '<h3>' + issue.title + '</h3>';
	str += '<p>' + issue.comment + '</p>';
	str += '<p style="text-align:center;">';

	if ('claim' === issue.type) {
		str += '<a href="#" class="btn btn-primary" role="button" data-type="edit" data-id="' + issue.id + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Ausfüllen</a>';
	} else if ('paper' === issue.type) {
		str += '<a href="#" class="btn btn-success" role="button" data-type="done" data-id="' + issue.id + '"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Vorhanden</a>';
		str += '&nbsp;&nbsp;';
		str += '<a href="#" class="btn btn-primary" role="button" data-type="edit" data-id="' + issue.id + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Beantragen</a>';
	} else if ('exists' === issue.type) {
		str += '<a href="#" class="btn btn-default disabled" role="button" data-type="done" data-id="' + issue.id + '"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Vorhanden</a>';
	} else if ('edit' === issue.type) {
		str += '<a href="#" class="btn btn-primary" role="button" data-type="edit" data-id="' + issue.id + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Bearbeiten</a>';
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
		$('#closedIssues h1').html('Du hast schon viel erledigt');
		$('#closedIssues .panel-body p').html('Diese Dokumente hast du vorbereitet und sind fertig:');

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

	pushIssue('GeburtsurkundeErstbeurkundung', 'Geburtsurkunde', 'Die Geburtsurkunde für das Baby', 'claim', 10);
	pushIssue('PersonalausweisMann', 'Personalausweis des Vaters', '... oder der Reisepass muss vorhanden sein', 'paper', -1);
	pushIssue('PersonalausweisFrau', 'Personalausweis der Mutter', '... oder der Reisepass muss vorhanden sein', 'paper', -1);
	pushIssue('GeburtsurkundeFrau', 'Geburtsurkunde der Mutter', 'Ein Nachweis, wo die Mutter geboren wurde', 'paper', -1);

	prepareOpenIssues();
	activateTab('#openIssues');
});

//-----------------------------------------------------------------------

$('#buttonHomeBirth').click(function (event) {
	'use strict';

	pushIssue('GeburtsurkundeErstbeurkundung', 'Geburtsurkunde', 'Die Geburtsurkunde für das Baby', 'claim', 10);
	pushIssue('AnzeigeErklärungVorFamilienname', 'Namenserklärung', 'Welchen Vor- und welchen Nachnamen soll das Baby erhalten', 'claim', -1);
	pushIssue('PersonalausweisMann', 'Personalausweis des Vaters', '... oder der Reisepass muss vorhanden sein', 'paper', -1);
	pushIssue('PersonalausweisFrau', 'Personalausweis der Mutter', '... oder der Reisepass muss vorhanden sein', 'paper', -1);
	pushIssue('GeburtsurkundeFrau', 'Geburtsurkunde der Mutter', 'Ein Nachweis, wo die Mutter geboren wurde', 'paper', -1);

	prepareOpenIssues();
	activateTab('#openIssues');
});

//-----------------------------------------------------------------------

$(document).ready(function () {
	'use strict';

	activateTab('#welcome');

	$('.navbar-right li:nth-child(1)').css('display', 'none');
	$('.navbar-right li:nth-child(2)').css('display', 'block');
	activateTab('#birth');
});

//-----------------------------------------------------------------------
