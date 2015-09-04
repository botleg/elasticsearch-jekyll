var form = document.getElementById('searchform'),
	box = document.getElementById('searchbox'),
	span = document.getElementById('query'),
	list = document.getElementById('post-list'),
	query = location.hash.slice(1),
	xhr = new XMLHttpRequest();

function render(results) {
	if (!results.length) {
		list.innerHTML = '<span class="text">Sorry, No results.</span>';
		return;
	}

	list.innerHTML = "";
	for (var i = 0; i < results.length; i++) {
		list.innerHTML += '<li><a class="post-link" href="/posts/' + results[i].id + '">' + results[i].title + '</a><p>' + results[i].summary + '</p></li>';
	}
}

function search() {
	span.innerHTML = query.split('+').join(' ');
	location.hash = query;
	list.innerHTML = '<span class="text">Loading results...</span>';

	xhr.open('GET', encodeURI('http://elastic.api.botleg.com/search/' + query));
	xhr.onload = function() {
		if (xhr.status === 200) {
			render(JSON.parse(xhr.responseText));
		}
	};
	xhr.send();
}

function searchFrm(e) {
	e.preventDefault();
	if (box.value.trim() !== '') {
		query = box.value.trim().split(' ').join('+');
		search();
	}
}

box.value = span.innerHTML = query.split('+').join(' ');
search();

if (form.addEventListener) {
	form.addEventListener("submit", searchFrm, false);
} else if (form.attachEvent) {
	form.attachEvent('onsubmit', searchFrm);
}