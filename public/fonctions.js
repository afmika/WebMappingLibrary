// fonctions de base
function setCookie(key, value) {
    document.cookie = key+'='+value;
}

function getCookie() {
	var cookie = document.cookie;
	if(cookie == '') {
		return null;
	}
	pseudo = cookie.split('=')[1];
	return pseudo == 'aucun' ? null : pseudo;
}
function configLink(url_get, obj) {
	url_get += "?";
	for(var i in obj) {
		url_get += i+"="+obj[i]+"&";
	}
	return url_get.substring(0, url_get.length - 1);
}
function deconnecter() {
	setCookie('pseudo', 'aucun');
	//window.open('/?logout=true');
}