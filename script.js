/**
 * ONMENU - RESPONSIVE SCRIPT.JS
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    let ticking = false;
    
    function updateNavbar() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('menu-open');       // ← TAMBAHAN FIX
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('menu-open');    // ← TAMBAHAN FIX
        }
    });

    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.body.classList.remove('menu-open');    // ← TAMBAHAN FIX
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.body.classList.remove('menu-open');    // ← TAMBAHAN FIX
        }
    });

    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const offsetTop = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // ============================================
    // FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all others
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            
            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ============================================
    // FORM SUBMISSION
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btnSubmit = contactForm.querySelector('.btn-submit');
            const originalText = btnSubmit.innerHTML;
            
            // Loading state
            btnSubmit.innerHTML = `
                <svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"></circle>
                </svg>
                Mengirim...
            `;
            btnSubmit.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                btnSubmit.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Terkirim!
                `;
                btnSubmit.style.background = '#22c55e';
                
                contactForm.reset();
                
                setTimeout(() => {
                    btnSubmit.innerHTML = originalText;
                    btnSubmit.style.background = '';
                    btnSubmit.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // SCROLL REVEAL ANIMATION
    // ============================================
    const revealElements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card, .step-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // ============================================
    // PRICING CARD HOVER (Desktop only)
    // ============================================
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    if (!isTouchDevice) {
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!this.classList.contains('featured')) {
                    this.style.transform = 'translateY(-8px)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (!this.classList.contains('featured')) {
                    this.style.transform = '';
                }
            });
        });
    }

    // ============================================
    // BUTTON RIPPLE EFFECT
    // ============================================
    document.querySelectorAll('.btn-primary, .pricing-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }
    `;
    document.head.appendChild(rippleStyle);

    console.log('✨ OnMenu Responsive loaded!');
});

/**
 * PRICING - SISTEM KOIN (TAMBAHAN)
 * Paste kode ini ke BAGIAN PALING BAWAH script.js Anda
 */

// Tunggu DOM ready
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // TOGGLE BULANAN / TAHUNAN
    // ============================================
    
    const pricingToggle = document.getElementById('pricingToggle');
    const membershipPrice = document.getElementById('membershipPrice');
    const membershipPeriod = document.getElementById('membershipPeriod');
    const priceNote = document.getElementById('priceNote');
    const monthlyLabel = document.getElementById('monthlyLabel');
    const yearlyLabel = document.getElementById('yearlyLabel');
    
    if (pricingToggle && membershipPrice) {
        // Harga membership
        const prices = {
            monthly: {
                amount: '99.000',
                period: '/bulan',
                note: 'Tanpa komitmen jangka panjang'
            },
            yearly: {
                amount: '960.000',
                period: '/tahun',
                note: 'Setara Rp 80.000/bulan'
            }
        };
        
        // Event listener untuk toggle
        pricingToggle.addEventListener('change', function() {
            const isYearly = this.checked;
            
            // Update price dengan animasi
            if (isYearly) {
                membershipPrice.textContent = prices.yearly.amount;
                membershipPeriod.textContent = prices.yearly.period;
                priceNote.textContent = prices.yearly.note;
                
                // Update label styles
                monthlyLabel.classList.remove('active');
                yearlyLabel.classList.add('active');
            } else {
                membershipPrice.textContent = prices.monthly.amount;
                membershipPeriod.textContent = prices.monthly.period;
                priceNote.textContent = prices.monthly.note;
                
                // Update label styles
                monthlyLabel.classList.add('active');
                yearlyLabel.classList.remove('active');
            }
            
            // Animasi scale pada price
            membershipPrice.style.transform = 'scale(1.1)';
            setTimeout(() => {
                membershipPrice.style.transform = 'scale(1)';
            }, 200);
        });
        
        // Set default ke yearly
        pricingToggle.checked = true;
    }
    
    // ============================================
    // COIN CARD HOVER ANIMATIONS
    // ============================================
    
    const coinCards = document.querySelectorAll('.coin-card');
    
    coinCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.coin-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(10deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.coin-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // ============================================
    // SISTEM KOIN CUSTOM - Rp 500/koin
    // ============================================
    
    const PRICE_PER_COIN = 500;
    
    function formatRupiah(amount) {
        return 'Rp ' + amount.toLocaleString('id-ID');
    }
    
    // Update live price saat input berubah
    function updateCustomCoinPrice() {
        const input = document.getElementById('customCoinInput');
        const livePrice = document.getElementById('customLivePrice');
        const livePriceNote = document.getElementById('customLivePriceNote');
        const buyBtn = document.getElementById('customCoinBuyBtn');
        
        if (!input || !livePrice || !buyBtn) return;
        
        const coins = parseInt(input.value) || 0;
        
        if (coins <= 0 || input.value === '') {
            livePrice.textContent = 'Masukkan jumlah koin';
            livePrice.classList.add('empty');
            if (livePriceNote) livePriceNote.textContent = '';
            buyBtn.disabled = true;
            buyBtn.style.opacity = '0.5';
            buyBtn.style.cursor = 'not-allowed';
            return;
        }
        
        const total = coins * PRICE_PER_COIN;
        livePrice.textContent = formatRupiah(total);
        livePrice.classList.remove('empty');
        if (livePriceNote) {
            livePriceNote.textContent = coins + ' koin × Rp ' + PRICE_PER_COIN.toLocaleString('id-ID') + '/koin';
        }
        
        buyBtn.disabled = false;
        buyBtn.style.opacity = '1';
        buyBtn.style.cursor = 'pointer';
        
        // Animasi scale
        livePrice.style.transform = 'scale(1.05)';
        setTimeout(() => { livePrice.style.transform = 'scale(1)'; }, 200);
    }
    
    // Fungsi tambah koin via tombol stepper
    function addCustomCoins(amount) {
        const input = document.getElementById('customCoinInput');
        if (!input) return;
        const current = parseInt(input.value) || 0;
        input.value = current + amount;
        updateCustomCoinPrice();
    }
    
    // Fungsi set koin langsung via tombol preset (50, 150, 500)
    function setCustomCoins(amount) {
        const input = document.getElementById('customCoinInput');
        if (!input) return;
        input.value = amount;
        updateCustomCoinPrice();
        
        // Highlight tombol preset yang aktif
        document.querySelectorAll('.coin-preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        // Cari tombol yang sesuai dan tandai aktif
        document.querySelectorAll('.coin-preset-btn').forEach(btn => {
            if (btn.getAttribute('onclick') === 'setCustomCoins(' + amount + ')') {
                btn.classList.add('active');
            }
        });
    }
    
    // Hapus highlight preset saat user mengetik manual
    const customCoinInputEl = document.getElementById('customCoinInput');
    if (customCoinInputEl) {
        customCoinInputEl.addEventListener('input', function() {
            document.querySelectorAll('.coin-preset-btn').forEach(btn => {
                btn.classList.remove('active');
            });
        });
    }
    
    // Expose ke global scope agar bisa dipanggil dari HTML (oninput / onclick)
    window.updateCustomCoinPrice = updateCustomCoinPrice;
    window.addCustomCoins = addCustomCoins;
    window.setCustomCoins = setCustomCoins;
    
    // ============================================
    // BUTTON CLICK HANDLERS
    // ============================================
    
    // Membership button
    const membershipBtn = document.querySelector('.membership-btn');
    if (membershipBtn) {
        membershipBtn.addEventListener('click', function(e) {
            console.log('Membership button clicked');
            // Tambahkan logika checkout di sini
            // window.location.href = '/checkout/membership';
        });
    }
    
    // Coin buttons (preset: 50, 150, 500)
    const coinButtons = document.querySelectorAll('.coin-btn:not(#customCoinBuyBtn)');
    coinButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const card = this.closest('.coin-card');
            if (card) {
                const coinNumber = card.querySelector('.coin-number');
                const priceAmount = card.querySelector('.price-amount');
                
                if (coinNumber && priceAmount) {
                    const coins = coinNumber.textContent;
                    const price = priceAmount.textContent;
                    
                    console.log(`Buying ${coins} coins for ${price}`);
                    // Tambahkan logika checkout di sini
                    // window.location.href = `/checkout/coins/${coins}`;
                }
            }
        });
    });
    
    // Tombol beli koin custom
    const customCoinBuyBtn = document.getElementById('customCoinBuyBtn');
    if (customCoinBuyBtn) {
        customCoinBuyBtn.addEventListener('click', function() {
            if (this.disabled) return;
            const input = document.getElementById('customCoinInput');
            const coins = parseInt(input.value) || 0;
            if (coins <= 0) return;
            const total = coins * PRICE_PER_COIN;
            console.log(`Buying custom ${coins} coins for ${formatRupiah(total)}`);
            // Tambahkan logika checkout di sini
            // window.location.href = `/checkout/coins/custom?amount=${coins}`;
        });
    }
    
    // ============================================
    // RIPPLE EFFECT
    // ============================================
    
    function createRipple(event) {
        const button = event.currentTarget;
        if (button.disabled) return;
        
        // Remove existing ripples
        const existingRipples = button.querySelectorAll('.ripple');
        existingRipples.forEach(r => r.remove());
        
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        `;
        ripple.classList.add('ripple');
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Add ripple effect to buttons
    const allPricingButtons = document.querySelectorAll('.membership-btn, .coin-btn');
    allPricingButtons.forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
    
    // Add ripple animation CSS
    if (!document.getElementById('ripple-animation-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation-style';
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============================================
    // SCROLL ANIMATIONS FOR PRICING
    // ============================================
    
    const pricingObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const pricingObserverCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    };
    
    const pricingObserver = new IntersectionObserver(pricingObserverCallback, pricingObserverOptions);
    
    // Observe pricing elements
    const pricingElements = [
        ...document.querySelectorAll('.membership-card'),
        ...document.querySelectorAll('.coin-card'),
        ...document.querySelectorAll('.info-card'),
        ...document.querySelectorAll('.faq-coin-item')
    ];
    
    pricingElements.forEach(el => {
        pricingObserver.observe(el);
    });
    
    // ============================================
    // CONSOLE LOG
    // ============================================
    
    console.log('💰 Pricing System - Coin Based Loaded!');
    console.log('Elements found:', {
        'Membership Card': document.querySelector('.membership-card') ? 'Yes' : 'No',
        'Coin Cards': document.querySelectorAll('.coin-card').length,
        'Pricing Toggle': pricingToggle ? 'Yes' : 'No',
        'Custom Coin Input': document.getElementById('customCoinInput') ? 'Yes' : 'No'
    });
});