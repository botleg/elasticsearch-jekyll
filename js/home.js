var form = document.getElementById('searchform');

function search(e) {
	e.preventDefault();
	if (document.getElementById('searchbox').value.trim() !== '') {
		window.location.href = '/search/#' + document.getElementById('searchbox').value.trim().split(' ').join('+');
	}
}

if (form.addEventListener) {
	form.addEventListener("submit", search, false);
} else if (form.attachEvent) {
	form.attachEvent('onsubmit', search);
}