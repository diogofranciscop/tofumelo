$(document).ready(function () {
    let el = $('.switch');
    let cur = el.find('.current');
    let options = el.find('.options li');
    let content = $('#content'); // Ensure this exists in your HTML

    // Open language dropdown panel
    el.on('click', function () {
        el.addClass('show-options');

        setTimeout(() => el.addClass('anim-options'), 50);
        setTimeout(() => el.addClass('show-shadow'), 200);
    });

    // Close language dropdown panel & switch language
    options.on('click', function (e) {
        e.stopPropagation();
        el.removeClass('anim-options show-shadow');

        let newLang = $(this).data('lang');

        cur.find('span').text(newLang);
        content.attr('class', newLang);
        setLang(newLang);

        options.removeClass('selected');
        $(this).addClass('selected');

        setTimeout(() => el.removeClass('show-options'), 600);

        // Redirect to the correct language version of the page
        switchLanguage(newLang);
    });

    // Detect the current language from the URL
    function getCurrentLang() {
        return window.location.pathname.startsWith("/en/") ? "en" : "pt";
    }

    function switchLanguage(newLang) {
        let currentPath = window.location.pathname;
        let newPath;

        if (newLang === "en" && !currentPath.startsWith("/en/")) {
            newPath = "/en" + currentPath; // Go to English
        } else if (newLang === "pt" && currentPath.startsWith("/en/")) {
            newPath = currentPath.replace("/en", ""); // Go to Portuguese
        } else {
            return; // Already on the correct language
        }

        window.location.href = newPath; // Redirect
    }

    // Load saved language or detect from URL
    function getLang() {
        let lang = localStorage.getItem('currentLang') || getCurrentLang();
        cur.find('span').text(lang);
        options.parent().find(`li[data-lang="${lang}"]`).addClass('selected');
        content.attr('class', lang);
    }

    getLang();

    function setLang(newLang) {
        localStorage.setItem('currentLang', newLang);
        content.attr('class', newLang);
    }
});
