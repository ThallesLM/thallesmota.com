// Aviso de cookies e etiqueta do Google Ads.
// Segue o Guia Orientativo de Cookies da ANPD (2022): rejeitar com o mesmo destaque que aceitar,
// publicidade desligada por padrão, segundo nível por categoria e revogação simples (rodapé).
// A etiqueta do Google só é carregada depois do aceite (modo de consentimento básico):
// antes disso, nenhuma chamada ao Google sai do navegador.
(function () {
  // Preencher com os dados da conta do Google Ads. Enquanto vazios, a etiqueta não existe.
  var ID_GOOGLE_ADS = '';      // ex.: 'AW-123456789'
  var ROTULO_WHATSAPP = '';    // rótulo da conversão "clique no WhatsApp"

  var CHAVE = 'consentimento-cookies';
  var VALIDADE_DIAS = 180;     // a escolha é perguntada de novo depois de 6 meses

  // O aviso é o mesmo em todas as páginas, por isso mora aqui (uma cópia só).
  var aviso = document.createElement('div');
  aviso.className = 'aviso-cookies';
  aviso.id = 'aviso-cookies';
  aviso.setAttribute('role', 'region');
  aviso.setAttribute('aria-label', 'Aviso de cookies');
  aviso.hidden = true;
  aviso.innerHTML =
    '<div class="faixa">' +
      '<p class="cookies-texto">Este site usa cookies necessários para funcionar. Com a sua permissão, também usa cookies de publicidade do Google, para medir se os anúncios trazem contatos. Saiba mais na <a href="privacidade.html#cookies">política de privacidade</a>.</p>' +
      '<div class="cookies-nivel2" hidden>' +
        '<div class="cookies-categoria">' +
          '<span><strong>Necessários</strong><span>Guardam a sua escolha sobre cookies.</span></span>' +
          '<span class="cookies-sempre">Sempre ativos</span>' +
        '</div>' +
        '<label class="cookies-categoria" for="cookies-publicidade">' +
          '<span><strong>Publicidade (Google Ads)</strong><span>Mostram se você chegou por um anúncio e se clicou no WhatsApp. Não personalizam anúncios.</span></span>' +
          '<input type="checkbox" id="cookies-publicidade" class="cookies-chave">' +
        '</label>' +
        '<button type="button" class="botao botao-linha" data-cookies="salvar">Salvar escolha</button>' +
      '</div>' +
      '<div class="cookies-botoes">' +
        '<button type="button" class="botao botao-linha" data-cookies="rejeitar">Rejeitar cookies não necessários</button>' +
        '<button type="button" class="botao botao-linha" data-cookies="aceitar">Aceitar todos</button>' +
        '<button type="button" class="cookies-configurar" data-cookies="configurar">Configurar</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(aviso);
  var caixa = document.getElementById('cookies-publicidade');
  var nivel2 = aviso.querySelector('.cookies-nivel2');
  var configurar = aviso.querySelector('[data-cookies="configurar"]');

  function lerEscolha() {
    try {
      var e = JSON.parse(localStorage.getItem(CHAVE));
      if (!e || typeof e.publicidade !== 'boolean') return null;
      if (Date.now() - new Date(e.data).getTime() > VALIDADE_DIAS * 864e5) return null;
      return e;
    } catch (_) { return null; }
  }

  function apagarCookiesDoGoogle() {
    // Só os cookies do próprio domínio; os dos domínios do Google o navegador não deixa apagar daqui.
    document.cookie.split(';').forEach(function (c) {
      var nome = c.split('=')[0].trim();
      if (/^(_gcl_|_gac_|FPGCL|FPGSID)/.test(nome)) {
        ['', '; domain=' + location.hostname, '; domain=.' + location.hostname.replace(/^www\./, '')].forEach(function (d) {
          document.cookie = nome + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  var etiquetaCarregada = false;
  function carregarEtiqueta() {
    if (etiquetaCarregada || !ID_GOOGLE_ADS) return;
    etiquetaCarregada = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    // Só medição de conversão: sem personalização de anúncios e sem Analytics.
    window.gtag('consent', 'default', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'denied',
      analytics_storage: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', ID_GOOGLE_ADS);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID_GOOGLE_ADS);
    document.head.appendChild(s);
  }

  // Conversão: clique em qualquer botão de WhatsApp, só com consentimento.
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href^="https://wa.me/"]');
    if (!a || !etiquetaCarregada || !ROTULO_WHATSAPP) return;
    window.gtag('event', 'conversion', { send_to: ID_GOOGLE_ADS + '/' + ROTULO_WHATSAPP, transport_type: 'beacon' });
  });

  function abrirNivel2(sim) {
    nivel2.hidden = !sim;
    configurar.hidden = sim;
  }

  function mostrar(segundoNivel) {
    var e = lerEscolha();
    caixa.checked = !!(e && e.publicidade);
    abrirNivel2(segundoNivel);
    aviso.hidden = false;
    document.body.classList.add('com-aviso-cookies');
    if (segundoNivel) caixa.focus();
  }

  function esconder() {
    aviso.hidden = true;
    document.body.classList.remove('com-aviso-cookies');
  }

  function salvar(publicidade) {
    var antes = lerEscolha();
    try {
      localStorage.setItem(CHAVE, JSON.stringify({ publicidade: publicidade, data: new Date().toISOString() }));
    } catch (_) { /* navegador sem armazenamento: vale só para esta visita */ }
    esconder();
    if (publicidade) {
      carregarEtiqueta();
    } else {
      apagarCookiesDoGoogle();
      // Se a etiqueta já estava rodando, recarregar a página é o único jeito de desligá-la.
      if (etiquetaCarregada || (antes && antes.publicidade)) location.reload();
    }
  }

  aviso.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-cookies]');
    if (!b) return;
    var acao = b.getAttribute('data-cookies');
    if (acao === 'aceitar') salvar(true);
    else if (acao === 'rejeitar') salvar(false);
    else if (acao === 'salvar') salvar(caixa.checked);
    else if (acao === 'configurar') { abrirNivel2(true); caixa.focus(); }
  });

  document.querySelectorAll('[data-abrir-cookies]').forEach(function (b) {
    b.addEventListener('click', function () { mostrar(true); });
  });

  var escolha = lerEscolha();
  if (escolha === null) mostrar(false);
  else if (escolha.publicidade) carregarEtiqueta();
})();
