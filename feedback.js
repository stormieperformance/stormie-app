/* Stormie Games playtest feedback.
   One shared widget for every game. Submissions go to Web3Forms, which emails them to the inbox tied to the access key.
   Usage: <script src="feedback.js" data-game="Trash Shift" defer></script>  (data-mode="inline" on the homepage) */
(() => {
  const ACCESS_KEY = ''; /* paste the Web3Forms access key here */
  const GAMES = ['Stormbound', 'The Witch of Moonlit Hollow', 'Forest Gathering', 'Last Arrow', 'Trash Shift', 'Schoolyard Bully', 'Jelly Riot', 'Tiny Kiwi', 'Storm//Duel', 'The whole site'];
  const me = document.currentScript, GAME = (me && me.dataset.game) || '', INLINE = me && me.dataset.mode === 'inline';
  if (!ACCESS_KEY && !/[?&]fbtest/.test(location.search)) return;

  const css = `
.sfb-tab{position:fixed;right:0;top:50%;z-index:9998;transform:translateY(-50%) rotate(180deg);writing-mode:vertical-rl;padding:12px 7px;border:0;border-radius:0 8px 8px 0;background:#ffd23a;color:#1a1030;font:600 11px/1 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.4);transition:opacity .25s,transform .25s}
.sfb-tab[hidden]{display:block;opacity:0;pointer-events:none;transform:translateY(-50%) rotate(180deg) translateX(-20px)}
.sfb-tab:focus-visible{outline:2px solid #fff;outline-offset:2px}
.sfb-wrap{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:max(12px,env(safe-area-inset-top)) 12px max(12px,env(safe-area-inset-bottom));background:rgba(8,6,16,.72);overflow-y:auto}
.sfb-wrap[hidden]{display:none}
.sfb{width:min(100%,420px);margin:auto;background:#181425;color:#f4efe6;border-radius:14px;padding:20px 18px 16px;box-shadow:0 0 0 1px rgba(255,255,255,.08),0 24px 60px rgba(0,0,0,.6);font:15px/1.45 system-ui,-apple-system,sans-serif;text-align:left}
.sfb h2{margin:0 0 2px;font-size:20px;line-height:1.2;color:#fff}
.sfb p.sub{margin:0 0 14px;color:#b8b0c8;font-size:13px}
.sfb label{display:block;margin:12px 0 5px;font-size:13px;font-weight:600;color:#e8e0f0}
.sfb select,.sfb textarea,.sfb input[type=email]{width:100%;box-sizing:border-box;padding:10px 11px;border-radius:8px;border:1px solid #3a3450;background:#0f0c18;color:#fff;font:inherit;font-size:16px}
.sfb textarea{min-height:68px;resize:vertical}
.sfb select:focus,.sfb textarea:focus,.sfb input:focus{outline:2px solid #ffd23a;outline-offset:1px;border-color:transparent}
.sfb .stars{display:flex;gap:6px}
.sfb .stars button{flex:1;min-height:44px;border:1px solid #3a3450;border-radius:8px;background:#0f0c18;color:#8a80a0;font-size:22px;line-height:1;cursor:pointer}
.sfb .stars button.on{background:#ffd23a;border-color:#ffd23a;color:#1a1030}
.sfb .chips{display:flex;flex-wrap:wrap;gap:6px}
.sfb .chips button{border:1px solid #3a3450;border-radius:999px;background:#0f0c18;color:#d8d0e8;padding:7px 11px;font:inherit;font-size:13px;cursor:pointer;min-height:36px}
.sfb .chips button.on{background:#4a3a8a;border-color:#8a7ae8;color:#fff}
.sfb .row{display:flex;gap:8px;margin-top:16px}
.sfb .send{flex:1;min-height:46px;border:0;border-radius:9px;background:#ffd23a;color:#1a1030;font:700 15px system-ui,sans-serif;cursor:pointer}
.sfb .send:disabled{opacity:.5;cursor:default}
.sfb .close{min-height:46px;padding:0 14px;border:1px solid #3a3450;border-radius:9px;background:transparent;color:#b8b0c8;font:inherit;cursor:pointer}
.sfb .note{margin:10px 0 0;font-size:11px;color:#8a80a0}
.sfb .msg{margin:10px 0 0;font-size:13px;min-height:1em}
.sfb .msg.err{color:#ff8a8a}
.sfb .done{text-align:center;padding:18px 0 6px}
.sfb .done b{display:block;font-size:40px;margin-bottom:6px}
.sfb .hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.sfb-inline{display:inline-flex;align-items:center;gap:8px;padding:13px 22px;border:1px solid currentColor;border-radius:4px;background:transparent;color:inherit;font:inherit;letter-spacing:.12em;text-transform:uppercase;font-size:12px;cursor:pointer}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const el = (tag, attrs = {}, kids = []) => { const n = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) { if (k === 'text') n.textContent = v; else n.setAttribute(k, v); } for (const c of kids) n.appendChild(c); return n; };

  /* ---------- the form ---------- */
  const wrap = el('div', { class: 'sfb-wrap', hidden: '', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'sfb-h' });
  const box = el('form', { class: 'sfb', novalidate: '' });
  wrap.appendChild(box);
  const state = { rating: 0, tags: new Set() };
  function build() {
    box.textContent = '';
    box.appendChild(el('h2', { id: 'sfb-h', text: 'Playtest feedback' }));
    box.appendChild(el('p', { class: 'sub', text: 'Thanks for playing! Tell me what worked and what did not. Every message is read.' }));
    const sel = el('select', { name: 'game', id: 'sfb-game' });
    for (const g of GAMES) { const o = el('option', { value: g, text: g }); if (g === GAME) o.selected = true; sel.appendChild(o); }
    box.appendChild(el('label', { for: 'sfb-game', text: 'Which game?' })); box.appendChild(sel);
    box.appendChild(el('label', { text: 'How fun was it?' }));
    const stars = el('div', { class: 'stars', role: 'radiogroup', 'aria-label': 'Rating from 1 to 5' });
    for (let i = 1; i <= 5; i++) {
      const b = el('button', { type: 'button', role: 'radio', 'aria-checked': 'false', 'aria-label': i + ' of 5', text: '★' });
      b.addEventListener('click', () => { state.rating = i; [...stars.children].forEach((s, k) => { s.classList.toggle('on', k < i); s.setAttribute('aria-checked', k === i - 1 ? 'true' : 'false'); }); });
      stars.appendChild(b);
    }
    box.appendChild(stars);
    box.appendChild(el('label', { text: 'Anything stand out?' }));
    const chips = el('div', { class: 'chips' });
    for (const t of ['Too hard', 'Too easy', 'Confusing', 'Controls felt off', 'Found a bug', 'Loved the music', 'Want more levels']) {
      const b = el('button', { type: 'button', 'aria-pressed': 'false', text: t });
      b.addEventListener('click', () => { const on = !state.tags.has(t); on ? state.tags.add(t) : state.tags.delete(t); b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
      chips.appendChild(b);
    }
    box.appendChild(chips);
    box.appendChild(el('label', { for: 'sfb-good', text: 'What was the best part?' }));
    box.appendChild(el('textarea', { id: 'sfb-good', name: 'best', maxlength: '1500', placeholder: 'The moment you enjoyed most' }));
    box.appendChild(el('label', { for: 'sfb-bad', text: 'What should I fix or change?' }));
    box.appendChild(el('textarea', { id: 'sfb-bad', name: 'fix', maxlength: '1500', placeholder: 'Where you got stuck, bored or confused. Which level?' }));
    box.appendChild(el('label', { for: 'sfb-mail', text: 'Email (optional, only if you want a reply)' }));
    box.appendChild(el('input', { type: 'email', id: 'sfb-mail', name: 'email', maxlength: '120', autocomplete: 'email' }));
    box.appendChild(el('input', { type: 'checkbox', name: 'botcheck', class: 'hp', tabindex: '-1', 'aria-hidden': 'true' }));
    const msg = el('p', { class: 'msg', role: 'status' });
    const send = el('button', { type: 'submit', class: 'send', text: 'Send feedback' });
    const close = el('button', { type: 'button', class: 'close', text: 'Close' });
    close.addEventListener('click', hide);
    box.appendChild(msg);
    box.appendChild(el('div', { class: 'row' }, [close, send]));
    box.appendChild(el('p', { class: 'note', text: 'Your device type and screen size are sent along to help track down bugs. Nothing else is collected.' }));
  }
  box.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(box), msg = box.querySelector('.msg'), send = box.querySelector('.send');
    if (f.get('botcheck')) return;
    const best = String(f.get('best') || '').trim(), fix = String(f.get('fix') || '').trim();
    if (!state.rating && !best && !fix && !state.tags.size) { msg.className = 'msg err'; msg.textContent = 'Add a rating or a few words first.'; return; }
    const game = String(f.get('game'));
    const data = {
      access_key: ACCESS_KEY,
      subject: `Playtest: ${game}${state.rating ? ' (' + state.rating + '/5)' : ''}`,
      from_name: 'Stormie Games playtest',
      game, rating: state.rating ? state.rating + ' / 5' : 'not given', tags: [...state.tags].join(', ') || 'none',
      best_part: best || '-', fix_or_change: fix || '-', reply_email: String(f.get('email') || '').trim() || 'not given',
      page: location.pathname, device: (matchMedia('(pointer:coarse)').matches ? 'Touch' : 'Mouse/keyboard') + ', ' + innerWidth + 'x' + innerHeight + (innerWidth > innerHeight ? ' landscape' : ' portrait'),
      browser: navigator.userAgent.slice(0, 180)
    };
    if (!ACCESS_KEY) { console.log('[feedback test]', data); return thanks(); }
    send.disabled = true; msg.className = 'msg'; msg.textContent = 'Sending...';
    try {
      const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.success === false) throw new Error(j.message || 'failed');
      thanks();
    } catch (err) { send.disabled = false; msg.className = 'msg err'; msg.textContent = 'Could not send right now. Check your connection and try again.'; }
  });
  function thanks() {
    box.textContent = '';
    box.appendChild(el('div', { class: 'done' }, [el('b', { text: '♥' }), el('h2', { text: 'Thank you!' }), el('p', { class: 'sub', text: 'Your feedback goes straight into the next update.' })]));
    const c = el('button', { type: 'button', class: 'send', text: 'Back to the game' }); c.addEventListener('click', hide);
    box.appendChild(el('div', { class: 'row' }, [c]));
  }
  let lastFocus = null;
  function show() { state.rating = 0; state.tags = new Set(); build(); lastFocus = document.activeElement; wrap.hidden = false; document.body.appendChild(wrap); const s = box.querySelector('select'); if (s) s.focus(); }
  function hide() { wrap.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  wrap.addEventListener('click', e => { if (e.target === wrap) hide(); });
  /* keep game hotkeys from firing while typing */
  for (const t of ['keydown', 'keyup', 'keypress']) wrap.addEventListener(t, e => { e.stopPropagation(); if (t === 'keydown' && e.key === 'Escape') hide(); });
  for (const t of ['pointerdown', 'touchstart', 'touchmove', 'touchend', 'gesturestart', 'dblclick']) wrap.addEventListener(t, e => e.stopPropagation(), { passive: true });
  window.StormieFeedback = { open: show };

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(wrap);
    if (INLINE) {
      for (const slot of document.querySelectorAll('[data-feedback-slot]')) { const b = el('button', { type: 'button', class: 'sfb-inline', text: 'Give playtest feedback' }); b.addEventListener('click', show); slot.appendChild(b); }
      return;
    }
    /* games: a side tab that only shows on menus and end screens, never over live play */
    const tab = el('button', { type: 'button', class: 'sfb-tab', text: 'Feedback', hidden: '' });
    tab.addEventListener('click', e => { e.stopPropagation(); show(); });
    tab.addEventListener('pointerdown', e => e.stopPropagation());
    document.body.appendChild(tab);
    const visible = n => { if (n.hidden || n.closest('[hidden]')) return false; const cs = getComputedStyle(n); return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > .2 && n.offsetWidth > 0; };
    setInterval(() => {
      const menu = [...document.querySelectorAll('.screen, .overlay')].some(visible);
      tab.hidden = !menu || !wrap.hidden;
    }, 400);
  });
})();
