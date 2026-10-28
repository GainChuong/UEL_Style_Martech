/**
 * main.js — Interactive UI & Progressive Lead Capture Engine
 * Implements Sections 12, 13, 14, 15, 16 of UEL STYLE Blueprint v2:
 * - 2-visit Progressive Profiling
 * - Identity Resolution & CRM Reconciliation Simulation
 * - Toast notifications & Modals
 */

let activeLeadSession = null;
let simulatedOTP = '789234';

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initLookbookSlider();
  initOtpInputHandlers();
  checkReturningVerifiedSession();
});

/* ==========================================================================
   Mobile Navigation Drawer
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('drawer-close-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('drawer-backdrop');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  window.closeDrawer = function() {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', window.closeDrawer);
  backdrop.addEventListener('click', window.closeDrawer);

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', window.closeDrawer);
  });
}

/* ==========================================================================
   Lookbook Slider Controls
   ========================================================================== */
function initLookbookSlider() {
  const prevBtn = document.getElementById('lookbook-prev-btn');
  const nextBtn = document.getElementById('lookbook-next-btn');
  const track = document.getElementById('lookbook-track');
  const wrapper = document.querySelector('.lookbook-slider-wrapper');

  if (!prevBtn || !nextBtn || !wrapper) return;

  const scrollAmount = 340;

  prevBtn.addEventListener('click', () => {
    wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

/* ==========================================================================
   OTP Inputs Auto-Focus & Navigation
   ========================================================================== */
function initOtpInputHandlers() {
  const digits = document.querySelectorAll('.otp-digit');
  digits.forEach((digit, index) => {
    digit.addEventListener('keyup', (e) => {
      if (e.key >= '0' && e.key <= '9') {
        if (index < digits.length - 1) {
          digits[index + 1].focus();
        }
      } else if (e.key === 'Backspace') {
        if (index > 0 && !digit.value) {
          digits[index - 1].focus();
        }
      }
    });

    digit.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData('text').trim();
      if (/^\d{6}$/.test(pasteData)) {
        pasteData.split('').forEach((char, i) => {
          if (digits[i]) digits[i].value = char;
        });
        digits[5].focus();
      }
    });
  });
}

/* ==========================================================================
   Check Returning Verified Session (Progressive Profiling Check)
   ========================================================================== */
function checkReturningVerifiedSession() {
  const sessionToken = sessionStorage.getItem('uel_verified_session');
  if (sessionToken) {
    try {
      const sessionData = JSON.parse(sessionToken);
      // Kiểm tra trong CRM Canonical DB
      const leads = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS_DB) || '[]');
      const matchedLead = leads.find(l => l.normalized_email === sessionData.normalized_email);
      
      if (matchedLead) {
        activeLeadSession = matchedLead;
        showStageReturning(matchedLead);
      }
    } catch (e) {
      console.warn('Session verification fallback', e);
    }
  }
}

/* ==========================================================================
   Step 1: Handle Initial Form Submit (Visit 1)
   ========================================================================== */
window.handleInitialFormSubmit = function(event) {
  event.preventDefault();

  const nameInput = document.getElementById('lead-name');
  const emailInput = document.getElementById('lead-email');
  const relationSelect = document.getElementById('lead-relation');
  const consentCheckbox = document.getElementById('marketing-consent');

  const errorName = document.getElementById('error-lead-name');
  const errorEmail = document.getElementById('error-lead-email');

  errorName.textContent = '';
  errorEmail.textContent = '';

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const relation = relationSelect.value;
  const optIn = consentCheckbox.checked;

  let isValid = true;

  if (!name) {
    errorName.textContent = 'Vui lòng nhập họ và tên của bạn.';
    nameInput.focus();
    isValid = false;
  }

  // Regex kiểm tra email chuẩn
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errorEmail.textContent = 'Email chưa đúng định dạng (Ví dụ: student@st.uel.edu.vn).';
    if (isValid) emailInput.focus();
    isValid = false;
  }

  if (!isValid) {
    trackLeadEvent('lead_form_validation_error', {
      form_stage: 'initial',
      field: !name ? 'display_name' : 'email'
    });
    return;
  }

  // Bắn sự kiện MarTech
  trackLeadEvent('lead_form_submit_attempt', {
    form_stage: 'initial',
    marketing_opt_in: optIn,
    source_placement: 'lead_section'
  });

  // Sinh mã OTP ngẫu nhiên 6 chữ số
  simulatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  document.getElementById('demo-otp-code').textContent = simulatedOTP;
  document.getElementById('verify-target-email').textContent = email;

  // Lưu tạm vào pending state
  activeLeadSession = {
    display_name: name,
    normalized_email: email,
    relation_to_uel: relation,
    marketing_email_opt_in: optIn,
    source_placement: 'lead_section_form'
  };

  // Kích hoạt cổng gửi OTP thực tế (Real Email / Sandbox)
  if (typeof sendRealEmailOtp === 'function') {
    sendRealEmailOtp(email, simulatedOTP, name);
  }

  // Chuyển sang màn hình xác minh OTP
  document.getElementById('form-stage-initial').style.display = 'none';
  document.getElementById('form-stage-verify').style.display = 'block';

  // Clear OTP digits
  document.querySelectorAll('.otp-digit').forEach(d => d.value = '');
  document.querySelectorAll('.otp-digit')[0].focus();

  trackLeadEvent('lead_verification_requested', {
    method: 'email_otp'
  });

  showToast('Đang gửi mã xác minh 6 số tới ' + email);
};

/* ==========================================================================
   Step 2: Handle OTP Verification
   ========================================================================== */
window.handleVerifyOtp = function() {
  const digits = document.querySelectorAll('.otp-digit');
  let enteredOtp = '';
  digits.forEach(d => enteredOtp += d.value.trim());

  const errorOtp = document.getElementById('error-otp');
  errorOtp.textContent = '';

  if (enteredOtp.length < 6) {
    errorOtp.textContent = 'Vui lòng nhập đủ 6 chữ số xác nhận.';
    return;
  }

  if (enteredOtp !== simulatedOTP) {
    errorOtp.textContent = 'Mã OTP không chính xác. Hãy nhập: ' + simulatedOTP;
    return;
  }

  // === RECONCILIATION & IDENTITY RESOLUTION ENGINE (Mục 16 Blueprint) ===
  const leads = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS_DB) || '[]');
  const existingLeadIndex = leads.findIndex(l => l.normalized_email === activeLeadSession.normalized_email);

  let finalLeadRecord = null;
  const nowIso = new Date().toISOString();

  if (existingLeadIndex >= 0) {
    // KHÁCH QUAY LẠI (Existing Lead -> MERGE / UPDATE)
    const existing = leads[existingLeadIndex];
    existing.display_name = activeLeadSession.display_name || existing.display_name;
    existing.relation_to_uel = activeLeadSession.relation_to_uel || existing.relation_to_uel;
    existing.email_verified_at = nowIso;
    existing.updated_at = nowIso;
    if (activeLeadSession.marketing_email_opt_in) {
      existing.marketing_email_opt_in = true;
    }
    leads[existingLeadIndex] = existing;
    finalLeadRecord = existing;

    trackLeadEvent('lead_crm_sync_result', {
      action: 'UPDATE_EXISTING',
      lead_id: existing.lead_id
    });
  } else {
    // LEAD MỚI TINH (New Canonical Lead)
    finalLeadRecord = {
      lead_id: 'lead-uel-' + Math.random().toString(36).substr(2, 8),
      display_name: activeLeadSession.display_name,
      normalized_email: activeLeadSession.normalized_email,
      email_verified_at: nowIso,
      relation_to_uel: activeLeadSession.relation_to_uel,
      profile_stage: 'stage_1_verified',
      marketing_email_opt_in: activeLeadSession.marketing_email_opt_in,
      interests: [],
      style_preference: '',
      price_range: '',
      source_placement: activeLeadSession.source_placement,
      created_at: nowIso,
      updated_at: nowIso
    };
    leads.push(finalLeadRecord);

    trackLeadEvent('lead_crm_sync_result', {
      action: 'CREATED_NEW',
      lead_id: finalLeadRecord.lead_id
    });
  }

  localStorage.setItem(STORAGE_KEYS.LEADS_DB, JSON.stringify(leads));
  sessionStorage.setItem('uel_verified_session', JSON.stringify({
    normalized_email: finalLeadRecord.normalized_email,
    verified_at: nowIso
  }));

  trackLeadEvent('lead_verification_success', {
    stage: 'stage_1_verified'
  });

  showToast('Xác minh thành công! Đang tải hồ sơ...');

  // Chuyển sang Form lần 2 (Progressive Enrichment)
  setTimeout(() => {
    showStageReturning(finalLeadRecord);
  }, 600);
};

window.handleResendOtp = function() {
  simulatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  document.getElementById('demo-otp-code').textContent = simulatedOTP;
  showToast('Đã gửi lại mã OTP mới: ' + simulatedOTP);
};

/* ==========================================================================
   Step 3: Show Returning Form (Progressive Profiling - Visit 2)
   ========================================================================== */
function showStageReturning(lead) {
  document.getElementById('form-stage-initial').style.display = 'none';
  document.getElementById('form-stage-verify').style.display = 'none';
  document.getElementById('form-stage-returning').style.display = 'block';

  document.getElementById('verified-user-name').textContent = lead.display_name || 'UELer';

  // Điền trước nếu đã có sở thích
  if (lead.interests && Array.isArray(lead.interests)) {
    document.querySelectorAll('input[name="interests"]').forEach(cb => {
      cb.checked = lead.interests.includes(cb.value);
    });
  }
  if (lead.style_preference) {
    document.getElementById('style-pref').value = lead.style_preference;
  }
  if (lead.price_range) {
    document.getElementById('price-range').value = lead.price_range;
  }

  trackLeadEvent('lead_form_view', {
    form_stage: 'enrichment',
    lead_id: lead.lead_id
  });
}

/* ==========================================================================
   Step 4: Handle Preferences Enrichment Submit
   ========================================================================== */
window.handleEnrichmentSubmit = function(event) {
  event.preventDefault();

  const selectedInterests = [];
  document.querySelectorAll('input[name="interests"]:checked').forEach(cb => {
    selectedInterests.push(cb.value);
  });

  const stylePref = document.getElementById('style-pref').value;
  const priceRange = document.getElementById('price-range').value;

  const leads = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS_DB) || '[]');
  const idx = leads.findIndex(l => l.normalized_email === activeLeadSession.normalized_email);

  if (idx >= 0) {
    leads[idx].interests = selectedInterests;
    leads[idx].style_preference = stylePref;
    leads[idx].price_range = priceRange;
    leads[idx].profile_stage = 'stage_2_enriched';
    leads[idx].updated_at = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.LEADS_DB, JSON.stringify(leads));
  }

  trackLeadEvent('lead_profile_enriched', {
    interests_count: selectedInterests.length,
    profile_stage: 'stage_2_enriched'
  });

  showStageCompleted('Sở thích của bạn đã được cập nhật thành công! UEL STYLE sẽ gửi những gợi ý outfit phù hợp nhất.');
};

window.skipEnrichment = function() {
  trackLeadEvent('lead_profile_enrich_skipped');
  showStageCompleted('Bạn có thể cập nhật sở thích bất kỳ lúc nào tại trung tâm cá nhân.');
};

function showStageCompleted(message) {
  document.getElementById('form-stage-returning').style.display = 'none';
  document.getElementById('form-stage-completed').style.display = 'block';
  document.getElementById('completion-message').textContent = message;
  showToast('Đã lưu thông tin vào hệ thống!');
}

window.resetFormView = function() {
  document.getElementById('form-stage-completed').style.display = 'none';
  document.getElementById('form-stage-initial').style.display = 'block';
  sessionStorage.removeItem('uel_verified_session');
};

/* ==========================================================================
   Voucher Copy Utility
   ========================================================================== */
window.copyVoucher = function() {
  const code = document.getElementById('display-voucher-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    showToast('Đã sao chép mã giảm giá: ' + code);
  }).catch(() => {
    showToast('Mã ưu đãi của bạn: ' + code);
  });
};

/* ==========================================================================
   Modals Management (Quick View, Privacy, Search)
   ========================================================================== */
window.openProductModal = function(title, price, imgUrl, desc) {
  document.getElementById('modal-product-title').textContent = title;
  document.getElementById('modal-product-price').textContent = price;
  document.getElementById('modal-product-img').src = imgUrl;
  document.getElementById('modal-product-desc').textContent = desc;

  const modal = document.getElementById('product-quick-modal');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  trackLeadEvent('product_quick_view', { item_name: title, price: price, title: title });
};

window.closeProductModal = function() {
  const modal = document.getElementById('product-quick-modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

window.openPrivacyModal = function(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('privacy-modal');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

window.closePrivacyModal = function() {
  const modal = document.getElementById('privacy-modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

// Search Modal
const searchTrigger = document.getElementById('search-modal-trigger');
const searchModal = document.getElementById('search-modal');

if (searchTrigger && searchModal) {
  searchTrigger.addEventListener('click', () => {
    searchModal.classList.add('active');
    document.getElementById('live-search-input').focus();
    document.body.style.overflow = 'hidden';
  });
}

window.closeSearchModal = function() {
  if (searchModal) {
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.selectSearchItem = function(targetHash) {
  closeSearchModal();
  window.location.hash = targetHash;
};

window.handleLiveSearch = function(query) {
  const items = document.querySelectorAll('#search-results-list .search-item');
  const lowerQ = query.toLowerCase().trim();
  items.forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = text.includes(lowerQ) ? 'flex' : 'none';
  });
};

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
function showToast(msg) {
  const toast = document.getElementById('toast-notify');
  if (!toast) return;
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 4000);
}
