// ── FIREBASE ──
//Pontos de melhoria
const firebaseConfig = {
    apiKey: "AIzaSyBaEobszaTJm36eIQDbMQqHtVsb0sNJgKk",
    authDomain: "dados-clientes-5f935.firebaseapp.com",
    projectId: "dados-clientes-5f935",
    storageBucket: "dados-clientes-5f935.firebasestorage.app",
    messagingSenderId: "25233274443",
    appId: "1:25233274443:web:984f0d408914447e8effce"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(), auth = firebase.auth(), gprov = new firebase.auth.GoogleAuthProvider();
// Fim pontos de melhoria

// ── CUSTOM CURSOR ──
const dot = document.getElementById('cursor-dot'), ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
(function animRing() { rx += (mx - rx) * .1; ry += (my - ry) * .1; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animRing); })();
document.querySelectorAll('a,button,[role="button"]').forEach(el => { el.addEventListener('mouseenter', () => ring.classList.add('hover')); el.addEventListener('mouseleave', () => ring.classList.remove('hover')); });

// ── WEBGL PARTICLE CANVAS (Lusion-style) ──
(function () {
    const canvas = document.getElementById('hero-canvas');
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return;
    let W, H, animId;
    const MAX = 180;
    const particles = [];
    function resize() { W = canvas.width = canvas.parentElement.offsetWidth; H = canvas.height = canvas.parentElement.offsetHeight; gl.viewport(0, 0, W, H); }
    window.addEventListener('resize', resize); resize();
    for (let i = 0; i < MAX; i++) particles.push({
        x: Math.random() * 2 - 1, y: Math.random() * 2 - 1,
        vx: (Math.random() - .5) * .0006, vy: (Math.random() - .5) * .0006,
        size: Math.random() * 2 + .5, life: Math.random()
    });
    const vsrc = `attribute vec2 a_pos;attribute float a_size;attribute float a_alpha;uniform vec2 u_res;void main(){gl_Position=vec4(a_pos,0,1);gl_PointSize=a_size;}`;
    const fsrc = `precision mediump float;uniform vec4 u_color;void main(){float d=distance(gl_PointCoord,vec2(.5));if(d>.5)discard;float a=1.-smoothstep(.3,.5,d);gl_FragColor=vec4(u_color.rgb,u_color.a*a);}`;
    function mkShader(t, s) { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); return sh; }
    const prog = gl.createProgram();
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, vsrc));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, fsrc));
    gl.linkProgram(prog); gl.useProgram(prog);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    const uColor = gl.getUniformLocation(prog, 'u_color');
    const buf = gl.createBuffer();
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    let t = 0;
    function frame() {
        animId = requestAnimationFrame(frame); t += .004;
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        const pos = new Float32Array(MAX * 2);
        particles.forEach((p, i) => {
            p.x += p.vx + Math.sin(t + i * .4) * .0001;
            p.y += p.vy + Math.cos(t + i * .3) * .0001;
            if (p.x > 1) p.x = -1; if (p.x < -1) p.x = 1;
            if (p.y > 1) p.y = -1; if (p.y < -1) p.y = 1;
            pos[i * 2] = p.x; pos[i * 2 + 1] = p.y;
        });
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        // Green particles
        gl.uniform4f(uColor, .29, .87, .5, .18);
        gl.drawArrays(gl.POINTS, 0, MAX * .7 | 0);
        // Gold accent particles
        gl.uniform4f(uColor, .96, .78, .26, .08);
        gl.drawArrays(gl.POINTS, MAX * .7 | 0, MAX * .3 | 0);
    }
    frame();
    // Pause when not visible
    document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(animId); else frame(); });
})();

// ── NAVBAR ──
const navbar = document.getElementById('navbar');
const hburg = document.getElementById('hamburger');
const drawer = document.getElementById('nav-drawer');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 40), { passive: true });
hburg.addEventListener('click', () => {
    const o = drawer.classList.toggle('open');
    hburg.classList.toggle('open', o);
    hburg.setAttribute('aria-expanded', o);
    document.body.style.overflow = o ? 'hidden' : '';
});
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    drawer.classList.remove('open'); hburg.classList.remove('open');
    hburg.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
}));

// ── SCROLL REVEAL ──
const revObs = new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }
}), { threshold: .1 });
document.querySelectorAll('.reveal,.reveal-left,.reveal-scale').forEach(el => revObs.observe(el));

// Legacy support for .revelar class
const revObs2 = new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visivel'); o.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.revelar').forEach(el => revObs2.observe(el));

// ── CONTADORES ANIMADOS ──
let cAtiv = false;
const cEls = document.querySelectorAll('.cont-num[data-alvo]');
if (cEls.length) {
    new IntersectionObserver((es, o) => {
        if (es[0].isIntersecting && !cAtiv) {
            cAtiv = true;
            cEls.forEach(el => {
                const alvo = +el.dataset.alvo, pref = el.dataset.pref || '', suf = el.dataset.suf || '', dur = 1800, t0 = performance.now();
                (function run(now) { const p = Math.min((now - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3); el.textContent = pref + Math.round(ease * alvo) + suf; if (p < 1) requestAnimationFrame(run); })(t0);
            });
            o.disconnect();
        }
    }, { threshold: .4 }).observe(cEls[0].closest('section'));
}

// ── SLIDER ANTES/DEPOIS ──
(function () {
    const sl = document.getElementById('slider-ba'), af = document.getElementById('ba-after'), dv = document.getElementById('ba-divisor');
    if (!sl) return;
    let drag = false;
    function mv(x) { const r = sl.getBoundingClientRect(), p = Math.max(5, Math.min(95, ((x - r.left) / r.width) * 100)); af.style.clipPath = `inset(0 ${100 - p}% 0 0)`; dv.style.left = p + '%'; }
    sl.addEventListener('mousedown', () => drag = true);
    window.addEventListener('mouseup', () => drag = false);
    window.addEventListener('mousemove', e => { if (drag) mv(e.clientX); }, { passive: true });
    sl.addEventListener('touchstart', e => { drag = true; e.preventDefault(); }, { passive: false });
    window.addEventListener('touchend', () => drag = false);
    window.addEventListener('touchmove', e => { if (drag) mv(e.touches[0].clientX); }, { passive: true });
    mv(sl.getBoundingClientRect().left + sl.offsetWidth * .5);
})();

// ── TOGGLE PREÇOS ──
const tF = document.getElementById('tab-frut'), tC = document.getElementById('tab-com');
const pF = document.getElementById('panel-frut'), pC = document.getElementById('panel-com');
if (tF && tC) {
    tF.addEventListener('click', () => { pF.classList.add('visivel'); pC.classList.remove('visivel'); tF.classList.add('ativo'); tF.setAttribute('aria-selected', 'true'); tC.classList.remove('ativo'); tC.setAttribute('aria-selected', 'false'); });
    tC.addEventListener('click', () => { pC.classList.add('visivel'); pF.classList.remove('visivel'); tC.classList.add('ativo'); tC.setAttribute('aria-selected', 'true'); tF.classList.remove('ativo'); tF.setAttribute('aria-selected', 'false'); });
}

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement, ab = item.classList.contains('aberto');
        document.querySelectorAll('.faq-item.aberto').forEach(i => { i.classList.remove('aberto'); i.querySelector('.faq-q').setAttribute('aria-expanded', 'false'); const a = i.querySelector('.faq-a'); a.setAttribute('hidden', ''); });
        if (!ab) { item.classList.add('aberto'); btn.setAttribute('aria-expanded', 'true'); item.querySelector('.faq-a').removeAttribute('hidden'); }
    });
});

// ── ESTRELAS ──
let nota = 0;
document.querySelectorAll('.estrela-btn').forEach(b => {
    b.addEventListener('click', () => { nota = +b.dataset.v; document.getElementById('dep-nota').value = nota; hil(nota); });
    b.addEventListener('mouseover', () => hil(+b.dataset.v));
    b.addEventListener('mouseout', () => hil(nota));
});
function hil(v) { document.querySelectorAll('.estrela-btn').forEach(b => b.classList.toggle('ativa', +b.dataset.v <= v)); }

// ── FIREBASE AUTH ──
const lStatus = document.getElementById('login-status'), fDep = document.getElementById('form-dep');
function bindLogin() { const bl = document.getElementById('btn-login'); if (bl) bl.addEventListener('click', () => auth.signInWithPopup(gprov).catch(console.error)); }
bindLogin();
document.getElementById('btn-logout').addEventListener('click', () => auth.signOut());
auth.onAuthStateChanged(user => {
    if (user) {
        lStatus.innerHTML = `<div class="login-info"><img src="${user.photoURL || ''}" alt="Foto" width="36" height="36" onerror="this.style.display='none'"/><span>Logado como <strong>${esc(user.displayName || user.email)}</strong></span></div>`;
        fDep.style.display = 'flex';
        const n = document.getElementById('dep-nome'); if (n && !n.value && user.displayName) n.value = user.displayName;
    } else {
        lStatus.innerHTML = `<p style="font-size:.88rem;color:var(--txt-secondary);margin-bottom:1rem">Entre com sua conta Google para garantir que os depoimentos são de clientes reais.</p><button id="btn-login" class="btn-solid">🔒 Entrar com Google para comentar</button>`;
        fDep.style.display = 'none'; bindLogin();
    }
});

// ── ENVIO DEPOIMENTO ──
fDep.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = document.getElementById('dep-msg'), btn = fDep.querySelector('button[type="submit"]'), user = auth.currentUser;
    const nome = document.getElementById('dep-nome').value.trim(), cidade = document.getElementById('dep-cidade').value.trim(), texto = document.getElementById('dep-texto').value.trim(), n = +document.getElementById('dep-nota').value;
    if (!nome || !cidade || !texto) { showMsg(msg, 'Preencha todos os campos obrigatórios.', 'e'); return; }
    if (n < 1) { showMsg(msg, 'Selecione uma avaliação de 1 a 5 estrelas.', 'e'); return; }
    if (texto.length < 20) { showMsg(msg, 'Seu depoimento precisa ter pelo menos 20 caracteres.', 'e'); return; }
    if (!user) { showMsg(msg, 'Faça login com o Google antes de enviar.', 'e'); return; }
    btn.disabled = true; btn.textContent = 'Enviando...';
    try {
        await db.collection('depoimentos').add({ nome, cidade, texto, nota: n, uid: user.uid, email: user.email, photoURL: user.photoURL || '', criadoEm: firebase.firestore.FieldValue.serverTimestamp(), aprovado: true });
        showMsg(msg, '🌿 Depoimento enviado! Obrigada por compartilhar.', 's');
        fDep.reset(); nota = 0; hil(0);
        if (window._pixelReady) fbq('track', 'Lead');
    } catch (err) { console.error(err); showMsg(msg, 'Erro ao enviar. Tente novamente.', 'e'); }
    finally { btn.disabled = false; btn.textContent = '🌿 Enviar meu depoimento'; }
});

// ── CARREGA DEPOIMENTOS DO FIREBASE ──
const depFB = document.getElementById('depoimentos-firebase');
db.collection('depoimentos').where('aprovado', '==', true).orderBy('criadoEm', 'desc').limit(9)
    .onSnapshot(snap => {
        if (snap.empty) return;
        depFB.innerHTML = ''; depFB.classList.add('tem-dados');
        snap.forEach(doc => {
            const d = doc.data(), est = '★'.repeat(d.nota || 5) + '☆'.repeat(5 - (d.nota || 5));
            const card = document.createElement('article');
            card.className = 'dep-card';
            const avatarHTML = d.photoURL
                ? `<img src="${d.photoURL}" alt="Foto de ${esc(d.nome)}" width="48" height="48" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;" onerror="this.outerHTML='<span style=\\'font-size:1.3rem\\'>👩</span>'">`
                : `<span style="font-size:1.3rem">👩</span>`;
            card.innerHTML = `<div class="dep-stars">${est}</div><p class="dep-text">${esc(d.texto)}</p><div class="dep-autor"><div class="dep-av">${avatarHTML}</div><div class="dep-info"><h4>${esc(d.nome)}</h4><span>${esc(d.cidade)}</span></div></div>`;
            depFB.appendChild(card);
        });
    }, err => console.error('Depoimentos:', err));

// ── EMAIL FORM ──
document.getElementById('form-email').addEventListener('submit', async e => {
    e.preventDefault();
    const msg = document.getElementById('email-msg'), btn = e.target.querySelector('button'), email = document.getElementById('email-in').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'Informe um e-mail válido.'; msg.style.color = '#f87171'; return; }
    btn.disabled = true; btn.textContent = 'Cadastrando...';
    try {
        await db.collection('leads_email').add({ email, fonte: 'cta_final', criadoEm: firebase.firestore.FieldValue.serverTimestamp(), consentimento: true });
        msg.textContent = '✅ Cadastro realizado! Você receberá nossas dicas em breve.'; msg.style.color = 'var(--verde-vivo)';
        document.getElementById('email-in').value = '';
        if (window._pixelReady) fbq('track', 'CompleteRegistration');
    } catch (err) { console.error(err); msg.textContent = 'Erro ao cadastrar. Tente novamente.'; msg.style.color = '#f87171'; }
    finally { btn.disabled = false; btn.textContent = 'Quero receber'; }
});

// ── COOKIES LGPD ──
const banner = document.getElementById('cookie-banner'), KEY = 'gg_cookie_v2';
if (!localStorage.getItem(KEY)) setTimeout(() => banner.classList.add('visivel'), 1200);
else if (localStorage.getItem(KEY) === 's') window.initPixel();
document.getElementById('cookie-aceitar').addEventListener('click', () => { localStorage.setItem(KEY, 's'); banner.classList.remove('visivel'); window.initPixel(); });
document.getElementById('cookie-recusar').addEventListener('click', () => { localStorage.setItem(KEY, 'n'); banner.classList.remove('visivel'); });

// ── WHATSAPP TRACKING ──
document.querySelectorAll('a[href*="wa.me"]').forEach(a => a.addEventListener('click', () => { if (window._pixelReady) fbq('track', 'Contact'); }));

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        const t = document.querySelector(this.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
    });
});

// ── PARALLAX SUTIL NO HERO ──
window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const s = window.scrollY;
    const canvas = document.getElementById('hero-canvas');
    if (canvas) canvas.style.transform = `translateY(${s * .3}px)`;
}, { passive: true });

// ── UTILITÁRIOS ──
function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
function showMsg(el, txt, tipo) { el.textContent = txt; el.className = 'form-msg-dep ' + tipo; setTimeout(() => { el.className = 'form-msg-dep'; el.textContent = ''; }, 7000); }
