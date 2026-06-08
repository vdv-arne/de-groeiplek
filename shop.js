(function () {
    var boxes = window.GROEIBOXEN || [];
    var tbody = document.getElementById('shop-body');
    if (!tbody) return;

    boxes.forEach(function (box) {
        var tr = document.createElement('tr');
        tr.setAttribute('tabindex', '0');
        tr.innerHTML =
            '<td><div class="thumb" style="background:' + box.kleur + '"></div></td>' +
            '<td><strong>' + box.naam + '</strong>' + (box.voorbeeld ? '<span class="tag-voorbeeld">voorbeeld</span>' : '') + '</td>' +
            '<td>' + box.korteBeschrijving + '</td>' +
            '<td>' + box.leeftijd + '</td>' +
            '<td class="prijs">' + box.prijs + '</td>' +
            '<td><button type="button" class="btn btn-row">Bekijk &amp; bestel</button></td>';
        tr.addEventListener('click', function () { openBox(box.id); });
        tr.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBox(box.id); }
        });
        tbody.appendChild(tr);
    });

    var modalRoot = document.getElementById('modal-root');
    var lastFocused = null;

    window.openBox = function (id) {
        var box = boxes.find(function (b) { return b.id === id; });
        if (!box || !modalRoot) return;
        lastFocused = document.activeElement;

        var itemsHtml = box.watZitErin.map(function (i) { return '<li>' + i + '</li>'; }).join('');
        modalRoot.innerHTML =
            '<div class="modal">' +
                '<button type="button" class="modal-close" aria-label="Sluiten">&times;</button>' +
                '<div class="modal-thumb" style="background:' + box.kleur + '"></div>' +
                '<h3 id="modal-title">' + box.naam + (box.voorbeeld ? '<span class="tag-voorbeeld">voorbeeld</span>' : '') + '</h3>' +
                '<p class="modal-prijs">' + box.prijs + ' &middot; ' + box.leeftijd + '</p>' +
                '<p>' + box.volledigeBeschrijving + '</p>' +
                '<h4>Wat zit erin?</h4>' +
                '<ul>' + itemsHtml + '</ul>' +
                '<div id="order-mount"></div>' +
            '</div>';

        if (typeof mountOrderForm === 'function') mountOrderForm(box);

        modalRoot.classList.add('open');
        document.body.style.overflow = 'hidden';
        modalRoot.querySelector('.modal-close').focus();
    };

    function closeModal() {
        if (!modalRoot) return;
        modalRoot.classList.remove('open');
        modalRoot.innerHTML = '';
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    if (modalRoot) {
        modalRoot.addEventListener('click', function (e) {
            if (e.target === modalRoot || e.target.closest('.modal-close')) closeModal();
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalRoot && modalRoot.classList.contains('open')) closeModal();
    });
    window.mountOrderForm = function (box) {
        var mount = document.getElementById('order-mount');
        if (!mount) return;
        mount.innerHTML =
            '<h4>Bestel deze box</h4>' +
            '<form data-web3form data-success="Bedankt voor je bestelling! Nele neemt snel contact op om alles te regelen." action="https://api.web3forms.com/submit" method="POST">' +
                '<input type="hidden" name="subject" value="Nieuwe Groeibox-bestelling: ' + box.naam + '">' +
                '<input type="hidden" name="from_name" value="De Groeiplek webshop">' +
                '<input type="hidden" name="box" value="' + box.naam + ' (' + box.prijs + ')">' +
                '<div class="form-group"><label>Box</label><input type="text" value="' + box.naam + ' — ' + box.prijs + '" disabled></div>' +
                '<div class="form-group"><label for="aantal">Aantal</label><input type="number" id="aantal" name="aantal" min="1" value="1" required></div>' +
                '<div class="form-group"><label for="o-naam">Naam</label><input type="text" id="o-naam" name="naam" required placeholder="Je naam"></div>' +
                '<div class="form-group"><label for="o-email">E-mail</label><input type="email" id="o-email" name="email" required placeholder="Je e-mailadres"></div>' +
                '<div class="form-group"><label for="o-adres">Adres</label><input type="text" id="o-adres" name="adres" required placeholder="Straat, nr, postcode, gemeente"></div>' +
                '<div class="form-group"><label for="o-opm">Opmerking (optioneel)</label><textarea id="o-opm" name="opmerking" placeholder="Bv. een vraag of een gewenste leverdatum"></textarea></div>' +
                '<input type="checkbox" name="botcheck" class="honeypot" tabindex="-1" autocomplete="off">' +
                '<button type="submit" class="btn btn-submit" data-label="Bestel">Bestel</button>' +
                '<p class="form-status" role="status" aria-live="polite"></p>' +
            '</form>';

        var form = mount.querySelector('form[data-web3form]');
        if (form && typeof submitWeb3Form === 'function') {
            form.addEventListener('submit', function (e) { e.preventDefault(); submitWeb3Form(form); });
        }
    };
})();
