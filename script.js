// ── Mobile nav toggle ──
function toggleNav(btn) {
    var links = document.querySelector('.nav-links');
    var open = links.classList.toggle('open');
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

// Close mobile nav when a link is clicked
document.addEventListener('click', function (e) {
    if (e.target.closest('.nav-links a')) {
        var links = document.querySelector('.nav-links');
        if (links) links.classList.remove('open');
    }
});

// ── Web3Forms submit handler ──
// Any <form data-web3form> on the page is handled here.
var WEB3FORMS_KEY = '745de682-dff3-4fcb-b62c-41aa8a15fbcf';

function initWeb3Forms() {
    var forms = document.querySelectorAll('form[data-web3form]');
    forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            submitWeb3Form(form);
        });
    });
}

function submitWeb3Form(form) {
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('button[type="submit"]');
    var data = Object.fromEntries(new FormData(form).entries());
    data.access_key = WEB3FORMS_KEY;

    if (btn) { btn.disabled = true; btn.textContent = 'Versturen…'; }
    if (status) { status.textContent = ''; status.className = 'form-status'; }

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(function (r) { return r.json(); })
    .then(function (res) {
        if (res.success) {
            var successMsg = form.getAttribute('data-success') || 'Bedankt! Je bericht is verstuurd. Nele neemt snel contact op.';
            form.innerHTML = '<div class="form-success-box"><h4>Bedankt!</h4><p>' + successMsg + '</p></div>';
        } else {
            showFormError(form, btn, status);
        }
    })
    .catch(function () { showFormError(form, btn, status); });
}

function showFormError(form, btn, status) {
    if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-label') || 'Verstuur'; }
    if (status) {
        status.textContent = 'Er ging iets mis. Probeer opnieuw of mail naar nele.meuleman@degroeiplek.be.';
        status.className = 'form-status error';
    }
}

document.addEventListener('DOMContentLoaded', initWeb3Forms);
