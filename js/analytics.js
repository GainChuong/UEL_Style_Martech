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
      { timestamp: Date.now() - 86400000 * 1, path: '/', referrer: 'instagram.com', device: 'mobile' },
      { timestamp: Date.now() - 3600000 * 4, path: '/', referrer: 'direct', device: 'desktop' },
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

// Bắn sự kiện MarTech (Section 19.1)
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

// Chạy tự động khi load
initAnalyticsEngine();
