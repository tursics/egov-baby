/*jslint browser: true*/
/*global $*/

//-----------------------------------------------------------------------

function activateTab(tab) {
	'use strict';

	$('.nav-tabs a[href="' + tab + '"]').tab('show');
	$('.nav').find('.active').removeClass('active');
	$('.nav a[href="' + tab + '"]').parent().addClass('active');
}

$('.navbar-nav > li').click(function (event) {
	'use strict';

	event.preventDefault();
	var target = $(this).find('>a').prop('hash');

	activateTab(target);
});

$(document).ready(function () {
	'use strict';

	activateTab('#welcome');
});
