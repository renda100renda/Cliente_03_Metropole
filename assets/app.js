
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Atualizar ano no rodapé
      const curYearEl = document.getElementById('curYear');
      if (curYearEl) curYearEl.textContent = new Date().getFullYear();

      // 2. Menu Hambúrguer Mobile
      const mobileBtn = document.getElementById('mobileMenuBtn');
      const mobileDrawer = document.getElementById('mobileDrawer');
      const mobileLinks = document.querySelectorAll('.mobile-link');

      if (mobileBtn && mobileDrawer) {
        mobileBtn.addEventListener('click', () => {
          mobileBtn.classList.toggle('active');
          mobileDrawer.classList.toggle('open');
        });

        mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            mobileDrawer.classList.remove('open');
          });
        });
      }

      // 3. Botão Voltar ao Topo
      const backToTopBtn = document.getElementById('backToTopBtn');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }, { passive: true });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      // 4. Simulador Personalizado de Agendamento WhatsApp (1 unidade única)
      const petTypeButtons = document.querySelectorAll('#petTypeGroup .service-chip');
      const petSizeButtons = document.querySelectorAll('#petSizeGroup .service-chip');
      const serviceButtons = document.querySelectorAll('#servicesChipGroup .service-chip');
      const otherServiceChip = document.getElementById('otherServiceChip');
      const customReqInput = document.getElementById('customReq');
      const petDaySelect = document.getElementById('petDaySelect');
      const petPeriodSelect = document.getElementById('petPeriodSelect');
      const msgPreview = document.getElementById('msgPreview');
      const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
      const sendWhatsAppBtnText = document.getElementById('sendWhatsAppBtnText');
      const bookingHelpText = document.getElementById('bookingHelpText');

      function syncAriaPressed(buttons) {
        buttons.forEach(btn => {
          const isSelected = btn.classList.contains('selected');
          btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        });
      }

      function updateWhatsAppMessage() {
        syncAriaPressed(petTypeButtons);
        syncAriaPressed(petSizeButtons);
        syncAriaPressed(serviceButtons);

        // Obter Tipo do Pet
        const activePetType = document.querySelector('#petTypeGroup .service-chip.selected');
        const petType = activePetType ? (activePetType.getAttribute('data-value') || activePetType.textContent.trim()) : 'Cachorro';

        // Obter Porte do Pet
        const activePetSize = document.querySelector('#petSizeGroup .service-chip.selected');
        const petSize = activePetSize ? (activePetSize.getAttribute('data-value') || activePetSize.textContent.trim()) : '';

        // Obter Serviços Selecionados
        const selectedServices = [];
        const activeServiceChips = document.querySelectorAll('#servicesChipGroup .service-chip.selected');
        const isOtherSelected = otherServiceChip && otherServiceChip.classList.contains('selected');
        const customText = customReqInput ? customReqInput.value.trim() : '';

        activeServiceChips.forEach(btn => {
          const val = btn.getAttribute('data-service') || btn.textContent.trim();
          if (val && val !== 'Outro/Personalizado') {
            selectedServices.push(val);
          }
        });

        if (isOtherSelected) {
          if (customText) {
            selectedServices.push(`Personalizado (${customText})`);
          } else {
            selectedServices.push('Outro / Personalizado');
          }
        } else if (customText) {
          selectedServices.push(`Observação (${customText})`);
        }

        const hasServiceSelected = selectedServices.length > 0;
        const hasSizeSelected = Boolean(petSize && petSize.length > 0);
        const isValid = hasServiceSelected && hasSizeSelected;

        // Atualizar estado e confirmação visual do botão
        if (sendWhatsAppBtn) {
          if (isValid) {
            sendWhatsAppBtn.disabled = false;
            sendWhatsAppBtn.removeAttribute('aria-disabled');
            sendWhatsAppBtn.classList.add('is-ready');
            if (sendWhatsAppBtnText) sendWhatsAppBtnText.textContent = 'Enviar pelo WhatsApp ✓';
            if (bookingHelpText) {
              bookingHelpText.textContent = '';
            }
          } else {
            sendWhatsAppBtn.disabled = true;
            sendWhatsAppBtn.setAttribute('aria-disabled', 'true');
            sendWhatsAppBtn.classList.remove('is-ready');
            if (sendWhatsAppBtnText) sendWhatsAppBtnText.textContent = 'Enviar pelo WhatsApp';
            if (bookingHelpText) {
              bookingHelpText.textContent = 'Selecione o serviço e o porte para continuar';
              bookingHelpText.style.color = '#D1D5DB';
            }
          }
        }

        const servicesStr = hasServiceSelected ? selectedServices.join(' + ') : 'Nenhum serviço selecionado ainda';
        const sizeStr = hasSizeSelected ? petSize : 'Não informado';
        const dayPref = petDaySelect ? petDaySelect.value : 'Segunda a sexta';
        const periodPref = petPeriodSelect ? petPeriodSelect.value : 'Manhã';

        // Mensagem oficial da Metrópole Pet Shop SEM citar unidade (unidade única na Vila Leopoldina)
        const message = `Olá! Vim pelo site da Metrópole Pet Shop e gostaria de agendar um atendimento.\n\n` +
          `• Tipo do pet: ${petType}\n` +
          `• Porte: ${sizeStr}\n` +
          `• Serviços desejados: ${servicesStr}\n` +
          `• Preferência de dia: ${dayPref}\n` +
          `• Período: ${periodPref}\n\n` +
          `Como podemos prosseguir com o agendamento?`;

        if (msgPreview) {
          msgPreview.textContent = message;
        }

        return { encoded: encodeURIComponent(message), isValid };
      }

      // Listeners para Tipo do Pet (seleção única com suporte a desmarcar/alternar)
      petTypeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          petTypeButtons.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          updateWhatsAppMessage();
        });
      });

      // Listeners para Porte do Pet (seleção única com alternância)
      petSizeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const wasSelected = btn.classList.contains('selected');
          petSizeButtons.forEach(b => b.classList.remove('selected'));
          if (!wasSelected) {
            btn.classList.add('selected');
          }
          updateWhatsAppMessage();
        });
      });

      // Listeners para Serviços (múltipla seleção com toggle direto)
      serviceButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          btn.classList.toggle('selected');

          // Se ativou o Outro/Personalizado, coloca foco no campo de texto
          if (btn.id === 'otherServiceChip' && btn.classList.contains('selected') && customReqInput) {
            customReqInput.focus();
          }

          updateWhatsAppMessage();
        });
      });

      // Se digitar no campo de texto, ativa automaticamente a opção Outro/Personalizado
      if (customReqInput) {
        customReqInput.addEventListener('input', () => {
          if (customReqInput.value.trim().length > 0 && otherServiceChip && !otherServiceChip.classList.contains('selected')) {
            otherServiceChip.classList.add('selected');
          }
          updateWhatsAppMessage();
        });
      }

      if (petDaySelect) petDaySelect.addEventListener('change', updateWhatsAppMessage);
      if (petPeriodSelect) petPeriodSelect.addEventListener('change', updateWhatsAppMessage);

      // Botão Enviar pelo WhatsApp
      if (sendWhatsAppBtn) {
        sendWhatsAppBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const { encoded, isValid } = updateWhatsAppMessage();
          if (!isValid) return;
          const url = `https://wa.me/5511992594990?text=${encoded}`;
          window.open(url, '_blank', 'noopener,noreferrer');
        });
      }

      // Inicializa estado e validação
      updateWhatsAppMessage();

      // 5. Carrossel de 14 Avaliações Reais
      const track = document.getElementById('carouselTrack');
      const cards = track ? Array.from(track.querySelectorAll('.review-card')) : [];
      const prevBtn = document.getElementById('prevReviewBtn');
      const nextBtn = document.getElementById('nextReviewBtn');
      const dotsContainer = document.getElementById('carouselDots');
      const carouselWrapper = document.getElementById('reviewsCarousel');

      if (track && cards.length > 0) {
        let currentIndex = 0;
        let autoPlayTimer = null;

        function getVisibleCardsCount() {
          const w = window.innerWidth;
          if (w >= 1024) return 3;
          if (w >= 640) return 2;
          return 1;
        }

        function getMaxIndex() {
          const visible = getVisibleCardsCount();
          return Math.max(0, cards.length - visible);
        }

        function buildDots() {
          dotsContainer.innerHTML = '';
          const max = getMaxIndex();
          for (let i = 0; i <= max; i++) {
            const dot = document.createElement('div');
            dot.className = `dot ${i === currentIndex ? 'active' : ''}`;
            dot.addEventListener('click', () => {
              currentIndex = i;
              updateCarousel();
              resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
          }
        }

        function updateCarousel() {
          const max = getMaxIndex();
          if (currentIndex > max) currentIndex = max;
          if (currentIndex < 0) currentIndex = 0;

          const cardWidth = cards[0].getBoundingClientRect().width;
          const gap = 20; // 20px gap no CSS
          const offset = currentIndex * (cardWidth + gap);
          track.style.transform = `translateX(-${offset}px)`;

          // Atualiza dots
          const dots = dotsContainer.querySelectorAll('.dot');
          dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });
        }

        function nextSlide() {
          const max = getMaxIndex();
          if (currentIndex >= max) {
            currentIndex = 0;
          } else {
            currentIndex++;
          }
          updateCarousel();
        }

        function prevSlide() {
          const max = getMaxIndex();
          if (currentIndex <= 0) {
            currentIndex = max;
          } else {
            currentIndex--;
          }
          updateCarousel();
        }

        function startAutoPlay() {
          stopAutoPlay();
          autoPlayTimer = setInterval(nextSlide, 5500); // Rotação suave a cada 5.5s
        }

        function stopAutoPlay() {
          if (autoPlayTimer) clearInterval(autoPlayTimer);
        }

        function resetAutoPlay() {
          stopAutoPlay();
          startAutoPlay();
        }

        nextBtn.addEventListener('click', () => {
          nextSlide();
          resetAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
          prevSlide();
          resetAutoPlay();
        });

        // Pausa no hover
        carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
        carouselWrapper.addEventListener('mouseleave', startAutoPlay);

        // Suporte a swipe no mobile
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
          stopAutoPlay();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          if (touchStartX - touchEndX > 45) {
            nextSlide();
          } else if (touchEndX - touchStartX > 45) {
            prevSlide();
          }
          startAutoPlay();
        }, { passive: true });

        window.addEventListener('resize', () => {
          buildDots();
          updateCarousel();
        });

        buildDots();
        updateCarousel();
        startAutoPlay();
      }

      // 6. FAQ Acordeão
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
          const wasActive = item.classList.contains('active');
          // Fechar todos
          faqItems.forEach(i => i.classList.remove('active'));
          // Se não estava ativo, abre
          if (!wasActive) {
            item.classList.add('active');
          }
        });
      });
    });
  
    // ===== Efeitos de rolagem =====
    // 1) Reveal suave nas secoes
    (function() {
      const targets = document.querySelectorAll('section, .service-card, .diff-card, .unit-card, .review-card, .about-card');
      targets.forEach((el, i) => {
        el.classList.add('reveal');
        if (i % 3 === 1) el.classList.add('reveal-delay-1');
        if (i % 3 === 2) el.classList.add('reveal-delay-2');
      });

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

      targets.forEach(el => io.observe(el));
    })();

    // 2) Header com sombra ao rolar
    (function() {
      const header = document.querySelector('header.site-header') || document.querySelector('.header-nav');
      if (!header) return;
      window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    })();
