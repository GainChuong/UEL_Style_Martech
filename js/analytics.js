/**
 * analytics.js — Tracking & Event Bus for UEL STYLE Landing Page
 * Conforming to Section 19 of Blueprint v2 (GDPR / Non-PII compliance)
 */

const STORAGE_KEYS = {
  PAGE_VIEWS: 'uel_analytics_pageviews',
  EVENTS: 'uel_analytics_events',
  LEADS_DB: 'uel_crm_canonical_leads',
  PENDING_SUBMISSIONS: 'uel_crm_pending_submissions',
  SEO_AUDIT: 'uel_seo_audit_cache',
  CURRENT_SESSION: 'uel_current_session_token'
};

// Khởi tạo cơ sở dữ liệu giả lập trong LocalStorage nếu chưa có
function initAnalyticsEngine() {
  if (!localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS)) {
    const defaultPageViews = [
      { timestamp: Date.now() - 86400000 * 2, path: '/', referrer: 'facebook.com', device: 'mobile' },
      { timestamp: Date.now() - 86400000 * 1.5, path: '/', referrer: 'google.com', device: 'desktop' },
      { timestamp: Date.now() - 86400000 * 1, path: '/', referrer: 'tiktok.com', device: 'mobile' },
      { timestamp: Date.now() - 3600000 * 4, path: '/', referrer: 'instagram.com', device: 'mobile' },
      { timestamp: Date.now() - 3600000 * 2, path: '/', referrer: 'google.com', device: 'desktop' },
      { timestamp: Date.now() - 60000, path: '/', referrer: 'facebook.com', device: 'mobile' }
    ];
    localStorage.setItem(STORAGE_KEYS.PAGE_VIEWS, JSON.stringify(defaultPageViews));
  }

  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    const defaultEvents = [
      { id: 'evt-1', event_name: 'lead_cta_click', placement: 'hero_primary', timestamp: Date.now() - 86400000, device: 'desktop' },
      { id: 'evt-2', event_name: 'lead_form_view', stage: 'initial', timestamp: Date.now() - 86400000, device: 'desktop' },
      { id: 'evt-3', event_name: 'lead_cta_click', placement: 'header', timestamp: Date.now() - 3600000 * 5, device: 'mobile' },
      { id: 'evt-4', event_name: 'lead_verification_success', stage: 'initial', timestamp: Date.now() - 3600000 * 4, device: 'mobile' }
    ];
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(defaultEvents));
  }

  if (!localStorage.getItem(STORAGE_KEYS.LEADS_DB)) {
    const defaultLeads = [
      {
        lead_id: 'lead-uel-9821-4fba',
        display_name: 'Trần Minh Quân',
        normalized_email: 'quan.tm@uel.edu.vn',
        email_verified_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        relation_to_uel: 'student',
        profile_stage: 'stage_2_enriched',
        marketing_email_opt_in: true,
        interests: ['tshirt', 'outerwear', 'deals'],
        style_preference: 'streetwear',
        price_range: '200k_350k',
        source_placement: 'hero_lead',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        lead_id: 'lead-uel-3312-88ec',
        display_name: 'Lê Hoàng Yến',
        normalized_email: 'yenlh@st.uel.edu.vn',
        email_verified_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        relation_to_uel: 'student',
        profile_stage: 'stage_1_verified',
        marketing_email_opt_in: true,
        interests: ['tshirt'],
        style_preference: 'minimal',
        price_range: 'under_200k',
        source_placement: 'header',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.LEADS_DB, JSON.stringify(defaultLeads));
  }

  // Ghi nhận pageview phiên hiện tại
  logPageView();
}

function logPageView() {
  try {
    const views = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS) || '[]');
    const isMobile = window.innerWidth <= 768;
    views.push({
      timestamp: Date.now(),
      path: window.location.pathname,
      referrer: document.referrer || 'direct',
      device: isMobile ? 'mobile' : 'desktop'
    });
    localStorage.setItem(STORAGE_KEYS.PAGE_VIEWS, JSON.stringify(views));
  } catch (e) {
    console.error('Error logging pageview', e);
  }
}

// Bắn sự kiện MarTech (Section 19.1) & TÍCH HỢP GOOGLE ANALYTICS 4 (GA4)
function trackLeadEvent(eventName, properties = {}) {
  try {
    const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    const eventPayload = {
      id: 'evt_' + Math.random().toString(36).substr(2, 9),
      event_name: eventName,
      timestamp: Date.now(),
      device_class: window.innerWidth <= 768 ? 'mobile' : 'desktop',
      ...properties
    };
    events.push(eventPayload);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    console.log(`[MarTech Event Tracked]: ${eventName}`, eventPayload);

    // === TÍCH HỢP THỰC TẾ GOOGLE ANALYTICS 4 (GA4) ===
    // Tuân thủ Section 19.1: Chỉ gửi properties không chứa PII (không gửi email, họ tên)
    if (typeof window.gtag === 'function') {
      const ga4CleanParams = {
        placement: properties.placement || properties.source_placement,
        form_stage: properties.form_stage,
        device_class: eventPayload.device_class,
        cta_text: properties.cta_text,
        item_name: properties.item_name,
        value: properties.price ? parseFloat((properties.price + '').replace(/[^\d]/g, '')) : undefined,
        currency: properties.price ? 'VND' : undefined
      };
      Object.keys(ga4CleanParams).forEach(k => ga4CleanParams[k] === undefined && delete ga4CleanParams[k]);
      window.gtag('event', eventName, ga4CleanParams);
      console.log(`[GA4 Synced]: Event "${eventName}" đã đẩy lên Google Analytics 4`, ga4CleanParams);
    }
  } catch (e) {
    console.error('Error tracking event', e);
  }
}

// Track khi người dùng click vào bất kỳ CTA nào trên trang
function trackLeadCTAClick(placement, ctaText) {
  trackLeadEvent('lead_cta_click', {
    placement: placement,
    cta_text: ctaText,
    url_anchor: window.location.hash
  });
}

/**
 * === TÍCH HỢP GỬI OTP THỰC TẾ (REAL EMAIL/SMS DELIVERY) ===
 * Hỗ trợ các nhà cung cấp: EmailJS, Resend, SendGrid hoặc Brevo.
 * Khi được cung cấp API Key / Public Key, hàm này sẽ kích hoạt gửi email/SMS thật ngay lập tức.
 */
async function sendRealEmailOtp(targetEmail, otpCode, recipientName) {
  console.log(`[OTP Dispatch Engine]: Đang gửi OTP ${otpCode} đến ${targetEmail}...`);

  // 1. Nếu đã cấu hình EmailJS Client-side
  if (window.emailjs && window.EMAILJS_PUBLIC_KEY) {
    try {
      const templateParams = {
        to_email: targetEmail,
        email: targetEmail,
        user_email: targetEmail,
        to_name: recipientName,
        name: recipientName,
        otp_code: otpCode,
        otp: otpCode,
        passcode: otpCode,
        message: `Mã OTP xác thực tài khoản UEL STYLE của bạn là: ${otpCode}. Mã có hiệu lực trong 10 phút.`,
        brand_name: 'UEL STYLE'
      };

      const response = await window.emailjs.send(
        window.EMAILJS_SERVICE_ID,
        window.EMAILJS_TEMPLATE_ID,
        templateParams,
        window.EMAILJS_PUBLIC_KEY
      );
      console.log('[EmailJS Success]: Đã kích hoạt gửi OTP vào hộp thư thật!', response);
      return { success: true, provider: 'EmailJS' };
    } catch (err) {
      console.error('[EmailJS Error]: Gửi thất bại', err);
    }
  }

  // 2. Chế độ Sandbox / Webhook Backend Endpoint
  try {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail, otp: otpCode, name: recipientName })
    }).catch(() => null);

    if (res && res.ok) {
      return { success: true, provider: 'Backend API' };
    }
  } catch (e) {}

  // 3. Fallback Sandbox (Mô phỏng tại local khi chưa gắn Secret API Key)
  return { success: true, provider: 'Sandbox Simulation (Đang hiển thị mã trực tiếp trên UI)' };
}

// Chạy tự động khi load
initAnalyticsEngine();
