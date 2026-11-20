// ---------- Everything you need to edit lives in INVITE and TEXT ----------
// TODO(Vlad & Betty): date, venue, schedule, story and contact below are placeholders.
const INVITE = {
  names: ['Vlad', 'Betty'],
  date: '2027-10-09T16:00:00+03:00', // ceremony start, with the Romanian UTC offset
  hours: 10, // event length, used for the calendar entry
  rsvpDeadline: '2027-08-15',
  venue: {
    name: 'Numele locației',
    address: 'Strada și numărul',
    city: 'București',
    mapQuery: 'București, România', // what Google Maps searches for
  },
  contactEmail: '',
  // POST target for RSVPs (Formspree, Google Apps Script…). Empty = open the guest's mail app instead.
  rsvpEndpoint: '',
};

const TEXT = {
  ro: {
    tapSeal: 'Atinge sigiliul pentru a deschide',
    heroIntro: 'Cu bucurie vă invităm\nla nunta noastră',
    cdTitle: 'Numărătoarea inversă', cdSub: 'până la cea mai frumoasă zi din viața noastră',
    days: 'zile', hours: 'ore', minutes: 'minute', seconds: 'secunde',
    venueTitle: 'Locația', venueSub: 'Unde ne vom sărbători iubirea',
    addCal: 'Adaugă în calendar', directions: 'Vezi traseul',
    dayTitle: 'Ziua nunții',
    storyTitle: 'Povestea noastră', storySub: 'Cum a început totul',
    faqTitle: 'Întrebări și răspunsuri', faqSub: 'Bine de știut',
    rsvpTitle: 'Confirmă prezența', rsvpBy: 'Vă rugăm să răspundeți până la',
    fName: 'Nume și prenume', fEmail: 'Email', fAttend: 'Veți fi alături de noi?',
    fYes: 'Confirm cu drag', fNo: 'Din păcate, nu pot ajunge',
    fGuests: 'Număr de persoane', fDiet: 'Restricții alimentare', fMsg: 'Mesaj (opțional)', fSend: 'Trimite confirmarea',
    sending: 'Se trimite…', sent: 'Mulțumim! Am primit răspunsul tău.',
    failed: 'Nu am putut trimite. Te rugăm să încerci din nou.',
    noTarget: 'Confirmările nu sunt încă active. Te rugăm să ne scrii direct.',
    footQ: 'Pentru orice întrebare, scrieți-ne',
    calTitle: 'Nunta Vlad & Betty', music: 'Muzică', lang: 'Switch to English',
    schedule: [
      ['16:00', 'Cununia', 'Jurăminte, verighete și clipa în care spunem „da”.'],
      ['18:00', 'Cina', 'O cină alături de oamenii pe care îi iubim.'],
      ['21:00', 'Petrecerea', 'Primul nostru dans, apoi ringul este al vostru.'],
    ],
    story: [
      ['2021-06-12', 'Ziua în care ne-am cunoscut', 'O întâlnire întâmplătoare și o conversație care nu s-a mai terminat.'],
      ['2023-02-14', 'Primul „te iubesc”', 'Neplanificat, dar exact la momentul potrivit.'],
      ['2026-09-05', 'Cererea în căsătorie', 'Mâini tremurânde, o întrebare și un „da” spus pe loc.'],
    ],
    faq: [
      ['Există parcare la locație?', 'Da, locația dispune de parcare pentru invitați.'],
      ['Care este ținuta recomandată?', 'Ținută elegantă. Culorile toamnei sunt binevenite.'],
      ['Aveți meniuri speciale?', 'Sigur! Spuneți-ne preferințele sau restricțiile alimentare în formularul de confirmare.'],
      ['Pot veni însoțit(ă)?', 'Da, vă rugăm doar să treceți numărul de persoane în formular.'],
    ],
  },
  en: {
    tapSeal: 'Tap the seal to open',
    heroIntro: 'We joyfully invite you\nto our wedding',
    cdTitle: 'Countdown', cdSub: 'to the most special day of our lives',
    days: 'days', hours: 'hours', minutes: 'minutes', seconds: 'seconds',
    venueTitle: 'The Venue', venueSub: "Where we'll celebrate our love",
    addCal: 'Add to calendar', directions: 'Get directions',
    dayTitle: 'Wedding Day',
    storyTitle: 'Our Love Story', storySub: 'How it all began',
    faqTitle: 'Questions & Answers', faqSub: 'Good to know',
    rsvpTitle: 'Confirm your presence', rsvpBy: 'Kindly respond by',
    fName: 'Full name', fEmail: 'Email', fAttend: 'Will you be attending?',
    fYes: 'Joyfully accept', fNo: 'Regretfully decline',
    fGuests: 'Number of guests', fDiet: 'Dietary restrictions', fMsg: 'Message (optional)', fSend: 'Send RSVP',
    sending: 'Sending…', sent: 'Thank you! We have received your reply.',
    failed: 'We could not send your reply. Please try again.',
    noTarget: 'RSVPs are not live yet. Please write to us directly.',
    footQ: 'For any questions, please get in touch',
    calTitle: 'Vlad & Betty — Wedding', music: 'Music', lang: 'Schimbă în română',
    schedule: [
      ['16:00', 'Ceremony', 'Vows, rings, and the moment we say yes.'],
      ['18:00', 'Dinner', 'A seated dinner with the people we love.'],
      ['21:00', 'Party', 'Our first dance, then the floor is all yours.'],
    ],
    story: [
      ['2021-06-12', 'The day we met', 'A chance meeting and a conversation that never really ended.'],
      ['2023-02-14', 'The first "I love you"', 'Not planned, just right.'],
      ['2026-09-05', 'The proposal', 'Shaky hands, one question, and an instant yes.'],
    ],
    faq: [
      ['Is there parking at the venue?', 'Yes, guest parking is available on site.'],
      ['What is the dress code?', 'Elegant attire. Autumn colours are very welcome.'],
      ['Do you accommodate dietary restrictions?', 'Of course! Tell us your preferences or restrictions in the RSVP form.'],
      ['Can I bring a plus-one?', 'Yes, just let us know the number of guests in the form.'],
    ],
  },
};

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const wedding = new Date(INVITE.date);
let lang = 'ro';

// ---------- Artwork ----------
// The canopy and hero corners are watercolour cut-outs (see README). Everything else is drawn here,
// seeded so it looks the same on every visit.
const rng = s => () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
const PAL = ['#2f3d24', '#4f5e34', '#4f5e34', '#6f8050', '#8a9a6b', '#8a9a6b', '#c5cdb0', '#a56e37']; // one autumn leaf in eight
const LIGHT = ['#fffdf6', '#e2e5d2', '#c5cdb0', '#c5cdb0', '#d9c08a']; // for dark backgrounds
const n1 = v => v.toFixed(1);
const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true">${inner}</svg>`;
const leaf = (l, w) => `M0 0C${n1(l * .25)} ${n1(-w)} ${n1(l * .7)} ${n1(-w)} ${n1(l)} 0C${n1(l * .7)} ${n1(w)} ${n1(l * .25)} ${n1(w)} 0 0Z`;
const shade = hex => '#' + hex.slice(1).match(/../g).map(h => Math.round(parseInt(h, 16) * .8).toString(16).padStart(2, '0')).join('');

// Shared gradients: every leaf darkens towards its tip, every petal towards its base.
document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${
  [...new Set([...PAL, ...LIGHT])].map(c => `<linearGradient id="lg-${c.slice(1)}"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="${shade(c)}"/></linearGradient>`).join('')
}<radialGradient id="petal" cx=".5" cy="1" r="1"><stop offset="0" stop-color="#e6dfcf"/><stop offset=".6" stop-color="#fffdf6"/></radialGradient></defs></svg>`);

// One stem along +x with alternating veined leaves and the odd berry.
function spray(R, len, bend = 0, pal = PAL) {
  const dark = pal === PAL;
  let out = `<path d="M0 0Q${n1(len / 2)} ${n1(len * bend)} ${n1(len)} 0" fill="none" stroke="${dark ? '#6b6a45' : '#c5cdb0'}" stroke-width=".9"/>`;
  const n = Math.max(4, Math.round(len / 10));
  for (let i = 1; i <= n; i++) {
    const t = i / n, x = len * t, y = 2 * len * bend * t * (1 - t);
    const slope = Math.atan2(2 * bend * (1 - 2 * t), 1) * 180 / Math.PI;
    const a = i === n ? slope : slope + (i % 2 ? 1 : -1) * (35 + R() * 30);
    const l = (9 + R() * 9) * (1.15 - t * .5), c = pal[R() * pal.length | 0];
    out += `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(a)})"><path d="${leaf(l, l * (.3 + R() * .16))}" fill="url(#lg-${c.slice(1)})"/><path d="M1 0H${n1(l * .88)}" stroke="#fff" stroke-opacity=".28" stroke-width=".5"/></g>`;
    if (R() < .12) out += `<circle cx="${n1(x + 3)}" cy="${n1(y + (i % 2 ? -5 : 5))}" r="${n1(1.5 + R())}" fill="${dark ? '#803f35' : '#d9c08a'}"/>`;
  }
  return out;
}
const at = (x, y, a, inner) => `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(a)})">${inner}</g>`;
// Two rings of shaded petals around gold stamens.
function bloom(R, x, y, s = 1) {
  let p = '';
  for (let ring = 0; ring < 2; ring++) for (let k = 0; k < 6; k++)
    p += `<ellipse cy="${ring ? -4 : -6}" rx="${ring ? 2.4 : 3.3}" ry="${ring ? 4 : 6}" fill="url(#petal)" stroke="#d6cbb2" stroke-width=".3" transform="rotate(${k * 60 + ring * 30})"/>`;
  for (let k = 0; k < 5; k++) p += `<circle cx="${n1(Math.cos(k * 1.257) * 1.7)}" cy="${n1(Math.sin(k * 1.257) * 1.7)}" r=".7" fill="#b8935a"/>`;
  return `<g transform="translate(${n1(x)} ${n1(y)}) scale(${n1(s)}) rotate(${n1(R() * 60)})">${p}<circle r=".9" fill="#a56e37"/></g>`;
}

const ART = {
  // Soft leaf layer behind the painted canopy, filling its gaps.
  backdrop(R) {
    let g = '';
    for (let x = 0; x <= 400; x += 11) g += at(x, R() * 6, 35 + R() * 110, spray(R, 20 + R() * 34, R() * .3 - .15));
    return svg(400, 70, g);
  },
  // The only moving foliage: short tendrils at the canopy's outer ends.
  tendrils(R) {
    let g = '';
    for (const x of [10, 32, 368, 390]) g += `<g transform="translate(${x} 60)"><g class="sway" style="--t:${n1(4 + R() * 3)}s;--d:${n1(-R() * 5)}s">${at(0, 0, 90 + R() * 8 - 4, spray(R, 60 + R() * 35, R() * .12 - .06))}</g></g>`;
    return svg(400, 170, g);
  },
  // Pale sprig with a bloom, for the dark venue card and footer.
  stem(R) {
    return svg(150, 50, at(68, 30, 192, spray(R, 58, .1, LIGHT)) + at(82, 30, -12, spray(R, 58, -.1, LIGHT)) + bloom(R, 75, 28, 1.5));
  },
  // Gold rule with a bloom.
  rule(R) {
    return svg(240, 30, '<path d="M20 15H102M138 15H220" stroke="#b8935a" stroke-width=".8"/>' + at(106, 15, 200, spray(R, 22, .1)) + at(134, 15, -20, spray(R, 22, -.1)) + bloom(R, 120, 15, 1.3));
  },
  // Greenery tucked under the wax seal.
  tuck(R) {
    return svg(190, 60, at(88, 30, 190, spray(R, 78, .08)) + at(102, 30, -10, spray(R, 78, -.08)));
  },
};
$$('[data-art]').forEach((el, i) => { el.innerHTML = ART[el.dataset.art](rng(7 + i * 131)); });

// Wax seal: a wobbly blob, drawn twice so the two halves can crack apart. Its shadow is part of
// the drawing, so the pulsing element needs no CSS filter.
function seal(side) {
  let d = '';
  for (let i = 0; i < 72; i++) {
    const a = i / 72 * 2 * Math.PI, r = 54 + 2.6 * Math.sin(3 * a + 1) + 1.8 * Math.sin(5 * a) + 1.4 * Math.sin(8 * a + 2);
    d += `${i ? 'L' : 'M'}${n1(60 + r * Math.cos(a))} ${n1(60 + r * Math.sin(a))}`;
  }
  const mono = `${INVITE.names[0][0]}&amp;${INVITE.names[1][0]}`;
  const txt = (dx, dy, fill) => `<text x="${60 + dx}" y="${72 + dy}" text-anchor="middle" font-family="Pinyon Script, cursive" font-size="33" fill="${fill}">${mono}</text>`;
  return `<svg class="${side}" viewBox="-9.6 -9.6 139.2 139.2" aria-hidden="true">
    <defs><radialGradient id="sg-${side}" cx=".36" cy=".28" r=".85"><stop offset="0" stop-color="#5a7349"/><stop offset=".55" stop-color="#2f3d24"/><stop offset="1" stop-color="#1c2616"/></radialGradient>
    <radialGradient id="sh-${side}"><stop offset=".65" stop-color="#1c2616" stop-opacity=".45"/><stop offset="1" stop-color="#1c2616" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="60" cy="66" rx="63" ry="61" fill="url(#sh-${side})"/>
    <path d="${d}Z" fill="url(#sg-${side})"/>
    <circle cx="60" cy="60" r="39" fill="#1c2616" fill-opacity=".35" stroke="#141c0f" stroke-width="1.6"/>
    <circle cx="60.8" cy="61" r="39" fill="none" stroke="#7d9468" stroke-width=".8" opacity=".7"/>
    ${txt(1, 1.3, '#141c0f')}${txt(0, 0, '#d9c08a')}</svg>`;
}
$('#seal').innerHTML = seal('l') + seal('r');

// Falling leaves and petals, kept to the hero's outer lanes and paused once the hero scrolls away.
{
  const R = rng(42);
  $('#leaves').innerHTML = ['#8a9a6b', '#4f5e34', '#fffdf6', '#a56e37', '#fffdf6', '#8a9a6b'].map(c =>
    `<div class="leaf" style="--x:${n1(R() < .5 ? R() * 7 : 90 + R() * 6)}%;--s:${n1(11 + R() * 9)}px;--t:${n1(12 + R() * 9)}s;--d:${n1(-R() * 20)}s"><svg viewBox="-2 -8 24 16"><path d="${leaf(20, 6.5)}" fill="${c}" stroke="#d6cbb2" stroke-width=".5" opacity=".9"/></svg></div>`).join('');
  new IntersectionObserver(([e]) => $('.hero').classList.toggle('away', !e.isIntersecting)).observe($('.hero'));
}

// ---------- Text ----------
const fmt = (d, opts) => new Intl.DateTimeFormat(lang, opts).format(d);
const longDate = d => fmt(d, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Bucharest' });
const reveal = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
}), { threshold: .15 });

function render() {
  const t = TEXT[lang], v = INVITE.venue;
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el => { el.textContent = t[el.dataset.i18n]; });
  $$('[data-name]').forEach(el => { el.textContent = INVITE.names[el.dataset.name]; });
  $$('[data-date]').forEach(el => { el.textContent = longDate(wedding); });
  $('[data-venue-short]').textContent = `${v.name}\n${v.city}`;
  $('[data-venue-name]').textContent = v.name;
  $('[data-venue-address]').textContent = `${v.address}, ${v.city}`;
  $('[data-rsvp-by]').textContent = `${t.rsvpBy} ${longDate(new Date(INVITE.rsvpDeadline + 'T12:00:00Z'))}`;
  $('#envelope').setAttribute('aria-label', t.tapSeal);
  $('#music').setAttribute('aria-label', t.music);
  $('#lang').textContent = lang === 'ro' ? 'EN' : 'RO';
  $('#lang').setAttribute('aria-label', t.lang);

  $('#schedule').innerHTML = t.schedule.map(([time, title, text], i) =>
    `<li class="reveal" style="--d:${i * .15}s"><time>${time}</time><div><h3>${title}</h3><p>${text}</p></div></li>`).join('');
  $('#story').innerHTML = t.story.map(([date, title, text], i) => {
    const d = new Date(date + 'T12:00:00Z');
    return `<li class="reveal" style="--d:${i * .1}s"><b>${d.getUTCFullYear()}</b><small>${fmt(d, { day: 'numeric', month: 'long', timeZone: 'UTC' })}</small><h3>${title}</h3><p>${text}</p></li>`;
  }).join('');
  $('#faq').innerHTML = t.faq.map(([q, a], i) =>
    `<details name="faq"${i ? '' : ' open'}><summary>${q}</summary><p>${a}</p></details>`).join('');
  $$('.reveal:not(.in)').forEach(el => reveal.observe(el));
}

// ---------- Venue, calendar ----------
{
  const v = INVITE.venue, q = encodeURIComponent(v.mapQuery);
  $('#map').src = `https://www.google.com/maps?q=${q}&z=15&output=embed`;
  $('#dir').href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  if (INVITE.contactEmail) { $('#mail').textContent = INVITE.contactEmail; $('#mail').href = `mailto:${INVITE.contactEmail}`; }
  else { $('[data-i18n="footQ"]').hidden = true; }
}
const icsStamp = d => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
$('#ics').onclick = () => {
  const v = INVITE.venue, esc = s => s.replace(/[,;\\]/g, '\\$&');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//invitatie//RO', 'BEGIN:VEVENT',
    `UID:${+wedding}@invitatie`, `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(wedding)}`, `DTEND:${icsStamp(new Date(+wedding + INVITE.hours * 36e5))}`,
    `SUMMARY:${esc(TEXT[lang].calTitle)}`, `LOCATION:${esc(`${v.name}, ${v.address}, ${v.city}`)}`,
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  a.download = 'nunta-vlad-betty.ics';
  a.click();
};

// ---------- Countdown ----------
const parts = ms => { const s = Math.max(0, Math.floor(ms / 1000)); return [s / 86400 | 0, s / 3600 % 24 | 0, s / 60 % 60 | 0, s % 60]; };
console.assert(parts(90061000).join() === '1,1,1,1' && parts(-5).join() === '0,0,0,0', 'countdown maths');
console.assert(icsStamp(new Date(Date.UTC(2027, 9, 9, 13))) === '20271009T130000Z', 'ics timestamp');
const cd = $$('[data-cd]');
function tick() {
  parts(wedding - Date.now()).forEach((n, i) => {
    const s = i ? String(n).padStart(2, '0') : String(n);
    if (cd[i].textContent === s) return;
    cd[i].textContent = s;
    cd[i].classList.remove('tick'); void cd[i].offsetWidth; cd[i].classList.add('tick');
  });
}

// ---------- RSVP ----------
const form = $('#rsvp'), status = $('#rsvp-status');
form.onchange = () => { $('#rsvp-yes').hidden = form.attending.value === 'no'; };
form.onsubmit = async e => {
  e.preventDefault();
  const t = TEXT[lang], data = Object.fromEntries(new FormData(form));
  if (data.attending === 'no') { delete data.guests; delete data.dietary; }
  if (INVITE.rsvpEndpoint) {
    status.textContent = t.sending;
    try {
      const r = await fetch(INVITE.rsvpEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error(r.status);
      form.reset(); form.onchange();
      status.textContent = t.sent;
    } catch { status.textContent = t.failed; }
  } else if (INVITE.contactEmail) {
    // shortcut: without an endpoint the reply goes through the guest's own mail app; set rsvpEndpoint to collect replies in one place.
    const body = Object.entries(data).map(([k, val]) => `${k}: ${val}`).join('\n');
    location.href = `mailto:${INVITE.contactEmail}?subject=${encodeURIComponent('RSVP ' + t.calTitle)}&body=${encodeURIComponent(body)}`;
  } else status.textContent = t.noTarget;
};

// ---------- Sound ----------
const bgm = $('#bgm'), musicBtn = $('#music');
bgm.volume = .6;
bgm.onplay = bgm.onpause = () => musicBtn.setAttribute('aria-pressed', !bgm.paused);
musicBtn.onclick = () => (bgm.paused ? bgm.play() : bgm.pause());
document.addEventListener('visibilitychange', () => { if (document.hidden) bgm.pause(); });

// Seal crack, paper flap and a soft chime, synthesised so there are no sound files to license.
function openSound() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ac = new AC(), now = ac.currentTime;
  const env = (g, t, peak, dur) => { g.gain.setValueAtTime(.0001, now + t); g.gain.exponentialRampToValueAtTime(peak, now + t + dur * .25); g.gain.exponentialRampToValueAtTime(.0001, now + t + dur); };
  const noise = (t, dur, freq, peak) => {
    const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    src.buffer = buf; f.type = 'bandpass'; f.Q.value = .8;
    f.frequency.setValueAtTime(freq, now + t); f.frequency.exponentialRampToValueAtTime(freq * 3, now + t + dur);
    env(g, t, peak, dur);
    src.connect(f).connect(g).connect(ac.destination); src.start(now + t);
  };
  noise(0, .14, 1600, .3);
  noise(.35, .95, 420, .14);
  [1318.5, 1975.5, 2637].forEach((hz, i) => {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.value = hz; env(g, 1.3 + i * .14, .05, 1.8);
    o.connect(g).connect(ac.destination); o.start(now + 1.3 + i * .14); o.stop(now + 3.6 + i * .14);
  });
  setTimeout(() => ac.close(), 5000);
}

// ---------- Opening ----------
const envelope = $('#envelope');
history.scrollRestoration = 'manual'; // a reload always starts at the envelope, so start at the top too
function open() {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  openSound();
  bgm.play().catch(() => {}); // blocked autoplay just leaves the music button off
  setTimeout(() => { document.body.className = 'opened'; }, 2400); // as the envelope starts to fade
  setTimeout(() => { envelope.hidden = true; }, 3200);
}
envelope.onclick = open;
envelope.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };

$('#lang').onclick = () => { lang = lang === 'ro' ? 'en' : 'ro'; render(); };
render();
tick();
setInterval(tick, 1000);
