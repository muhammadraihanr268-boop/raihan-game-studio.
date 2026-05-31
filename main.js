// ===== NAVIGATION =====
const nav = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const pageLoader = document.getElementById('pageLoader');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== PAGE ROUTING =====
function showPage(pageId, pushState = true) {
  // loader
  pageLoader.style.width = '30%';
  setTimeout(() => pageLoader.style.width = '100%', 200);
  setTimeout(() => pageLoader.style.width = '0%', 600);

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const navLink = document.querySelector(`.nav-links a[data-page="${pageId}"]`);
  if (navLink) navLink.classList.add('active');

  if (pushState) {
    history.pushState({ page: pageId }, '', '#' + pageId);
  }

  initPageAnimations();
}

window.addEventListener('popstate', (e) => {
  const page = e.state?.page || 'home';
  showPage(page, false);
});

document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = el.getAttribute('data-page');
    showPage(pageId);
  });
});

// ===== PARTICLES =====
function createParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: 0;
    `;
    // Some particles in magenta
    if (Math.random() > 0.7) {
      p.style.background = '#ff006e';
    }
    container.appendChild(p);
  }
}

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + (el.dataset.suffix || '+');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(counter, parseInt(counter.dataset.count));
          obs.unobserve(counter);
        }
      });
    });
    obs.observe(counter);
  });
}

// ===== SCROLL ANIMATIONS =====
function initPageAnimations() {
  setTimeout(() => {
    const fadeEls = document.querySelectorAll('.page.active .fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    fadeEls.forEach(el => observer.observe(el));
    initCounters();
  }, 100);
}

// ===== PORTFOLIO FILTER =====
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        if (filter === 'all' || item.dataset.genre === filter) {
          item.style.display = 'block';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

// ===== FAQ ACCORDION =====
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    const successMsg = document.getElementById('successMsg');
    btn.disabled = true;
    btn.textContent = 'MENGIRIM...';
    setTimeout(() => {
      btn.textContent = '✓ TERKIRIM';
      btn.style.background = 'var(--accent-green)';
      if (successMsg) {
        successMsg.style.display = 'block';
      }
      form.reset();
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'KIRIM PESAN';
        btn.style.background = '';
        if (successMsg) successMsg.style.display = 'none';
      }, 4000);
    }, 1500);
  });
}

// ===== BLOG DETAIL =====
function showBlogDetail(id) {
  const articles = getBlogArticles();
  const article = articles.find(a => a.id === id);
  if (!article) return;

  const detail = document.getElementById('blogDetail');
  const list = document.getElementById('blogList');
  detail.style.display = 'block';
  list.style.display = 'none';

  document.getElementById('detailThumb').className = `blog-detail-thumb ${article.bg}`;
  document.getElementById('detailThumbIcon').textContent = article.icon;
  document.getElementById('detailCategory').textContent = article.category;
  document.getElementById('detailTitle').textContent = article.title;
  document.getElementById('detailDate').textContent = article.date;
  document.getElementById('detailRead').textContent = article.read;
  document.getElementById('detailBody').innerHTML = article.body;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideBlogDetail() {
  const detail = document.getElementById('blogDetail');
  const list = document.getElementById('blogList');
  detail.style.display = 'none';
  list.style.display = 'block';
}

function getBlogArticles() {
  return [
    {
      id: 1,
      title: 'Tren Game Development 2026: AI dan Prosedural Generation',
      category: 'INDUSTRI',
      icon: '🤖',
      bg: 'b1',
      date: '28 Mei 2026',
      read: '6 menit baca',
      excerpt: 'AI semakin mengubah cara developer membuat game. Pelajari tren terkini yang mendominasi industri.',
      body: `
        <p>Industri game development terus berevolusi dengan kecepatan yang mengagumkan. Di tahun 2026, dua teknologi mendominasi pembicaraan: kecerdasan buatan (AI) dan prosedural generation. Keduanya bukan hal baru, namun integrasinya yang makin mendalam mengubah fundamental cara game dibuat.</p>
        <h2>AI sebagai Co-Developer</h2>
        <p>Alat berbasis AI kini mampu membantu programmer menulis kode lebih cepat, menghasilkan aset visual dari deskripsi teks, dan bahkan menyusun narasi adaptif yang bereaksi pada keputusan pemain. Studio besar seperti EA dan Ubisoft telah mengintegrasikan pipeline AI ke dalam workflow mereka.</p>
        <h2>Prosedural Generation Semakin Canggih</h2>
        <p>Teknik prosedural bukan hanya untuk dungeon yang dihasilkan secara random. Kini mencakup:</p>
        <ul>
          <li>World-building yang koheren secara naratif</li>
          <li>NPC dengan behavior yang dinamis</li>
          <li>Quest generation berbasis konteks cerita</li>
          <li>Adaptive music dan soundscape</li>
        </ul>
        <h2>Dampak bagi Indie Developer</h2>
        <p>Kabar baiknya adalah teknologi ini semakin terjangkau dan accessible. Tools seperti Unity AI dan Unreal Engine MetaHuman memperkecil gap antara indie studio dan AAA studio. Di Raihan Game Studio sendiri, kami sudah mulai mengeksplor AI-assisted asset generation untuk mempersingkat produksi.</p>
        <p>Masa depan game development terlihat sangat menarik. Bagi developer Indonesia, ini adalah peluang besar untuk bersaing di panggung global dengan resource yang lebih efisien.</p>
      `
    },
    {
      id: 2,
      title: 'Panduan Memilih Engine Game untuk Proyek Pertama Anda',
      category: 'TUTORIAL',
      icon: '🎮',
      bg: 'b2',
      date: '20 Mei 2026',
      read: '8 menit baca',
      excerpt: 'Unity, Unreal, Godot, atau GameMaker? Kami breakdown kelebihan dan kekurangan masing-masing engine.',
      body: `
        <p>Salah satu keputusan pertama dan terpenting dalam memulai pengembangan game adalah memilih engine yang tepat. Pilihan yang salah bisa membuat proses development menjadi jauh lebih sulit dari yang seharusnya.</p>
        <h2>Unity — Si Serbaguna</h2>
        <p>Unity adalah pilihan paling populer di kalangan indie developer. Kelebihannya meliputi dokumentasi yang luas, komunitas besar, dan dukungan multi-platform yang sangat baik. Cocok untuk hampir semua genre game dari mobile casual hingga VR/AR.</p>
        <h2>Unreal Engine — Kekuatan Visual AAA</h2>
        <p>Jika visual adalah prioritas utama Anda, Unreal Engine adalah jawabannya. Dengan teknologi Lumen dan Nanite, kualitas grafis yang dihasilkan luar biasa. Namun kurva belajarnya lebih curam dan membutuhkan hardware yang lebih kuat.</p>
        <h2>Godot — Open Source yang Berkembang Pesat</h2>
        <p>Godot adalah pilihan ideal untuk developer yang menginginkan engine ringan, open-source, dan gratis sepenuhnya. Sempurna untuk game 2D, dan dukungan 3D-nya terus berkembang pesat.</p>
        <h2>GameMaker — Untuk Game 2D Cepat</h2>
        <p>Jika target Anda adalah game 2D sederhana atau Anda ingin prototyping cepat, GameMaker menawarkan workflow yang streamlined dengan bahasa scripting GML yang mudah dipelajari.</p>
        <p>Rekomendasi kami: mulai dengan Unity atau Godot untuk pemula, sesuaikan dengan genre game yang ingin Anda buat.</p>
      `
    },
    {
      id: 3,
      title: 'Monetisasi Game Mobile yang Etis dan Efektif',
      category: 'BISNIS',
      icon: '💰',
      bg: 'b3',
      date: '14 Mei 2026',
      read: '5 menit baca',
      excerpt: 'Bagaimana cara menghasilkan revenue dari game tanpa merusak pengalaman bermain pengguna.',
      body: `
        <p>Monetisasi adalah tantangan terbesar bagi developer game mobile. Terlalu agresif dan Anda kehilangan pemain. Terlalu pasif dan bisnis Anda tidak sustainable. Temukan keseimbangan yang tepat.</p>
        <h2>Model Freemium yang Benar</h2>
        <p>Freemium bukan berarti free-to-start, pay-to-win. Model yang sehat memberikan pengalaman bermain yang lengkap secara gratis, dengan pembelian opsional yang mempercantik atau memperkaya — bukan yang menghalangi kemajuan pemain.</p>
        <h2>Cosmetic-Only IAP</h2>
        <p>Skin, kostum, emote, dan item dekoratif adalah contoh monetisasi yang paling diterima komunitas. Pemain merasa tidak dipaksa, dan mereka yang membeli merasa mendapatkan value eksklusif.</p>
        <h2>Season Pass vs Gacha</h2>
        <p>Season pass memberikan value yang jelas dengan harga tetap. Gacha meskipun bisa sangat profitable, sering kali menimbulkan kontroversi. Di Raihan Game Studio, kami lebih memilih model yang transparan dan fair.</p>
        <p>Ingat: pemain yang bahagia lebih cenderung merekomendasikan game Anda kepada orang lain. Word-of-mouth masih merupakan marketing terbaik di industri game.</p>
      `
    },
    {
      id: 4,
      title: 'Membangun Tim Game Development yang Solid',
      category: 'MANAJEMEN',
      icon: '👥',
      bg: 'b4',
      date: '5 Mei 2026',
      read: '7 menit baca',
      excerpt: 'Tips praktis membangun dan mengelola tim kreatif untuk proyek game development.',
      body: `
        <p>Di balik setiap game yang sukses ada tim yang solid. Namun membangun tim game development yang efektif adalah tantangan tersendiri, terutama bagi studio kecil dengan budget terbatas.</p>
        <h2>Peran Kunci dalam Tim</h2>
        <p>Tim game development minimal membutuhkan: programmer, artist, dan game designer. Untuk proyek yang lebih besar, tambahkan sound designer, QA tester, dan producer. Satu orang bisa merangkap beberapa peran di studio kecil.</p>
        <h2>Remote vs On-Site</h2>
        <p>Tren remote work memberikan akses ke talent pool yang lebih luas. Banyak studio indie terbaik di dunia beroperasi sepenuhnya remote. Kuncinya ada pada komunikasi yang baik dan tools kolaborasi yang tepat.</p>
        <h2>Budaya Tim yang Sehat</h2>
        <p>Crunch culture adalah musuh produktivitas jangka panjang. Pastikan tim memiliki work-life balance yang sehat, apresiasi yang tulus, dan kesempatan untuk berkembang.</p>
        <p>Raihan Game Studio percaya bahwa tim yang bahagia menghasilkan game yang lebih baik. Kami berkomitmen pada lingkungan kerja yang positif dan inklusif.</p>
      `
    },
    {
      id: 5,
      title: 'Mengoptimalkan Performa Game untuk Mobile Low-End',
      category: 'TEKNIK',
      icon: '⚡',
      bg: 'b5',
      date: '28 April 2026',
      read: '9 menit baca',
      excerpt: 'Strategi teknis untuk memastikan game Anda berjalan mulus di device entry-level Indonesia.',
      body: `
        <p>Indonesia adalah pasar mobile gaming terbesar kelima di dunia, namun mayoritas pemain menggunakan device mid-range hingga low-end. Mengoptimalkan game untuk segmen ini bukan pilihan, melainkan keharusan.</p>
        <h2>Optimasi Grafis</h2>
        <p>Mulai dengan mengurangi polygon count pada model 3D. Gunakan LOD (Level of Detail) untuk menampilkan model resolusi rendah saat objek jauh. Texture atlas mengurangi draw calls secara signifikan.</p>
        <h2>Memory Management</h2>
        <p>Hindari memory leak dengan memanage asset loading dan unloading secara aktif. Gunakan object pooling untuk objek yang sering di-spawn seperti peluru atau partikel.</p>
        <h2>Battery dan Thermal</h2>
        <p>Cap frame rate di 30fps untuk genre yang tidak membutuhkan responsivitas tinggi. Kurangi frekuensi update physics. Monitor thermal throttling pada berbagai device.</p>
        <p>Target hardware testing kami selalu mencakup device dengan RAM 2GB dan chipset kelas bawah. Ini memastikan jangkauan pasar yang maksimal di Indonesia dan negara berkembang lainnya.</p>
      `
    },
    {
      id: 6,
      title: 'Game Lokal Indonesia di Panggung Global: Peluang dan Tantangan',
      category: 'INDUSTRI',
      icon: '🇮🇩',
      bg: 'b6',
      date: '18 April 2026',
      read: '6 menit baca',
      excerpt: 'Menilik potensi industri game Indonesia untuk bersaing dan berkembang di pasar internasional.',
      body: `
        <p>Industri game Indonesia sedang berada di persimpangan sejarah. Dengan populasi gamer yang masif dan talenta developer yang semakin berkembang, saatnya game lokal melangkah ke panggung global.</p>
        <h2>Keunggulan Kompetitif Kita</h2>
        <p>Indonesia memiliki kekayaan budaya yang unik yang belum banyak dieksplorasi dalam game. Dari wayang hingga Majapahit, dari keanekaragaman nusantara hingga mitologi lokal — ini adalah material storytelling yang autentik dan menarik bagi audiens global yang haus akan perspektif baru.</p>
        <h2>Tantangan yang Harus Diatasi</h2>
        <p>Pendanaan masih menjadi hambatan utama. Berbeda dengan Vietnam atau Thailand yang memiliki ekosistem VC gaming yang lebih matang, Indonesia masih perlu membangun infrastruktur pendanaan yang lebih kuat. Selain itu, kesenjangan skill di area tertentu seperti narrative design masih perlu dijembatani.</p>
        <h2>Jalan ke Depan</h2>
        <p>Kolaborasi antar studio lokal, dukungan pemerintah melalui program Bekraf, dan akses ke platform global seperti Steam dan Google Play telah memperlancar jalan. Game seperti DreadOut membuktikan bahwa developer Indonesia mampu menciptakan produk berkualitas global.</p>
        <p>Raihan Game Studio berdiri di garis terdepan pergerakan ini, berkomitmen untuk membawa cerita dan kreativitas Indonesia ke seluruh dunia.</p>
      `
    }
  ];
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initPortfolioFilter();
  initFAQ();
  initContactForm();

  // Handle initial hash
  const hash = window.location.hash.replace('#', '') || 'home';
  showPage(hash, false);

  // Smooth page transitions from footer links
  document.querySelectorAll('.footer-links a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });
});
