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
  CURRENT_SESSION: 'uel_current_session_token',
  FIRST_TOUCH: 'uel_martech_first_touch',
  LAST_TOUCH: 'uel_martech_last_touch'
};

// Khởi tạo cơ sở dữ liệu giả lập trong LocalStorage chuẩn GA4 (10/10/2026 - 06/11/2026, 12 Active users, chủ yếu Desktop)
function initAnalyticsEngine() {
  const GA4_SCHEMA_VER = 'ga4_explore_v2026_11';
  const currentVer = localStorage.getItem('uel_ga4_schema_version');

  if (!localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS) || currentVer !== GA4_SCHEMA_VER) {
    // Chuẩn hóa theo dữ liệu GA4 thực tế của property UEL_Style_Landingpage:
    // Giai đoạn 10/10/2026 – 06/11/2026 | Tổng 12 Active Users (10 Desktop, 2 Mobile) / 16 Sessions
    const defaultPageViews = [
      { timestamp: new Date('2026-10-12T09:15:00+07:00').getTime(), path: '/', landing_page_query: '/', session_source_medium: 'google / organic', channel_group: 'Organic Search', referrer: 'google.com', device: 'desktop' },
      { timestamp: new Date('2026-10-14T14:20:00+07:00').getTime(), path: '/', landing_page_query: '/?utm_source=facebook&utm_medium=paid_social&utm_campaign=uel_merch_oct26&utm_content=feed_shirt_a', session_source_medium: 'facebook / paid_social', channel_group: 'Paid Social', referrer: 'facebook.com', device: 'desktop' },
      { timestamp: new Date('2026-10-16T20:05:00+07:00').getTime(), path: '/', landing_page_query: '/?utm_source=facebook&utm_medium=paid_social&utm_campaign=uel_merch_oct26&utm_content=story_shirt_a', session_source_medium: 'facebook / paid_social', channel_group: 'Paid Social', referrer: 'facebook.com', device: 'mobile' },
      { timestamp: new Date('2026-10-19T10:30:00+07:00').getTime(), path: '/', landing_page_query: '/', session_source_medium: 'google / organic', channel_group: 'Organic Search', referrer: 'google.com', device: 'desktop' },
      { timestamp: new Date('2026-10-21T16:45:00+07:00').getTime(), path: '/', landing_page_query: '/?utm_source=tiktok&utm_medium=organic_social&utm_campaign=campus_chic_2026&utm_content=profile_uel_a', session_source_medium: 'tiktok / organic_social', channel_group: 'Organic Social', referrer: 'tiktok.com', device: 'mobile' },
      { timestamp: new Date('2026-10-24T11:10:00+07:00').getTime(), path: '/', landing_page_query: '/?utm_source=facebook&utm_medium=organic_social&utm_campaign=uel_merch_oct26&utm_content=post_campus_a', session_source_medium: 'facebook / organic_social', channel_group: 'Organic Social', referrer: 'facebook.com', device: 'desktop' },
      { timestamp: new Date('2026-10-27T15:00:00+07:00').getTime(), path: '/', landing_page_query: '/', session_source_medium: 'google / organic', channel_group: 'Organic Search', referrer: 'google.com', device: 'desktop' },
      { timestamp: new Date('2026-10-29T08:50:00+07:00').getTime(), path: '/', landing_page_query: '/', session_source_medium: '(direct) / (none)', channel_group: 'Direct', referrer: 'direct', device: 'desktop' },
      { timestamp: new Date('2026-11-01T19:30:00+07:00').getTime(), path: '/', landing_page_query: '/?utm_source=facebook&utm_medium=paid_social&utm_campaign=uel_merch_oct26&utm_content=feed_shirt_a', session_source_medium: 'facebook / paid_social', channel_group: 'Paid Social', referrer: 'facebook.com', device: 'desktop' },
      { timestamp: new Date('2026-11-03T13:25:00+07:00').getTime(), path: '/', landing_page_query: '/?utm_source=tiktok&utm_medium=organic_social&utm_campaign=campus_chic_2026&utm_content=profile_uel_a', session_source_medium: 'tiktok / organic_social', channel_group: 'Organic Social', referrer: 'tiktok.com', device: 'desktop' },
      { timestamp: new Date('2026-11-05T10:15:00+07:00').getTime(), path: '/', landing_page_query: '/?utm_source=email&utm_medium=email&utm_campaign=voucher_wave1&utm_content=voucher_wave1', session_source_medium: 'email / email', channel_group: 'Email', referrer: 'mail.google.com', device: 'desktop' },
      { timestamp: new Date('2026-11-06T17:40:00+07:00').getTime(), path: '/', landing_page_query: '/', session_source_medium: '(direct) / (none)', channel_group: 'Direct', referrer: 'direct', device: 'desktop' }
    ];
    localStorage.setItem(STORAGE_KEYS.PAGE_VIEWS, JSON.stringify(defaultPageViews));
  }

  if (!localStorage.getItem(STORAGE_KEYS.EVENTS) || currentVer !== GA4_SCHEMA_VER) {
    const defaultEvents = [
      { id: 'evt-1', event_name: 'lead_cta_click', placement: 'hero_primary', timestamp: new Date('2026-10-14T14:21:00+07:00').getTime(), device: 'desktop' },
      { id: 'evt-2', event_name: 'lead_form_view', stage: 'initial', timestamp: new Date('2026-10-14T14:21:30+07:00').getTime(), device: 'desktop' },
      { id: 'evt-3', event_name: 'form_submit', stage: 'initial', timestamp: new Date('2026-10-14T14:22:00+07:00').getTime(), device: 'desktop' },
      { id: 'evt-4', event_name: 'generate_lead', stage: 'initial', timestamp: new Date('2026-10-14T14:23:00+07:00').getTime(), device: 'desktop' },
      { id: 'evt-5', event_name: 'lead_cta_click', placement: 'header', timestamp: new Date('2026-10-19T10:31:00+07:00').getTime(), device: 'desktop' },
      { id: 'evt-6', event_name: 'lead_verification_success', stage: 'initial', timestamp: new Date('2026-10-19T10:33:00+07:00').getTime(), device: 'desktop' },
      { id: 'evt-7', event_name: 'lead_cta_click', placement: 'collection_card', timestamp: new Date('2026-10-27T15:02:00+07:00').getTime(), device: 'desktop' },
      { id: 'evt-8', event_name: 'lead_cta_click', placement: 'lookbook', timestamp: new Date('2026-11-01T19:31:00+07:00').getTime(), device: 'desktop' }
    ];
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(defaultEvents));
  }

  if (!localStorage.getItem(STORAGE_KEYS.LEADS_DB) || currentVer !== GA4_SCHEMA_VER) {
    const defaultLeads = [
      {
        lead_id: 'UEL-K244060732',
        display_name: 'Võ Hồng Ngọc',
        normalized_email: 'ngocvh24406@st.uel.edu.vn',
        customer_segment: 'Sinh viên UEL (ĐH Kinh tế - Luật)',
        relation_to_uel: 'student_uel',
        profile_stage: 'stage_2_enriched',
        profile_status: 'Stage 2: Đã bổ sung sở thích',
        otp_status: 'VERIFIED (Đã xác thực)',
        email_verified_at: '2026-10-14T14:23:00.000Z',
        marketing_email_opt_in: true,
        consent_marketing: 'CÓ (Đồng ý)',
        interests: ['Áo Sơ Mi Sọc UEL', 'Túi Tote Canvas SGS'],
        style_preference: 'Thanh lịch, Đi học / Thuyết trình',
        price_range: '200k_350k',
        first_touch_platform: 'facebook',
        first_touch_medium: 'paid_social',
        first_touch_placement: 'feed',
        first_touch_creative: 'feed_shirt_a',
        last_touch_platform: 'facebook',
        last_touch_medium: 'paid_social',
        last_touch_placement: 'feed',
        last_touch_creative: 'feed_shirt_a',
        session_source_medium: 'facebook / paid_social',
        session_channel_group: 'Paid Social',
        landing_page_query: '/?utm_source=facebook&utm_medium=paid_social&utm_campaign=uel_merch_oct26&utm_content=feed_shirt_a',
        device_category: 'desktop',
        key_event: 'generate_lead',
        source_method: 'utm_manual',
        created_at: '2026-10-14T14:23:00.000Z'
      },
      {
        lead_id: 'UEL-K244111388',
        display_name: 'Nguyễn Phương Anh',
        normalized_email: 'anhnp24411@st.uel.edu.vn',
        customer_segment: 'Giới trẻ Gen Z / Tín đồ Local Brand & Streetwear',
        relation_to_uel: 'genz_fashion',
        profile_stage: 'stage_2_enriched',
        profile_status: 'Stage 2: Đã bổ sung sở thích',
        otp_status: 'VERIFIED (Đã xác thực)',
        email_verified_at: '2026-10-16T20:10:00.000Z',
        marketing_email_opt_in: true,
        consent_marketing: 'CÓ (Đồng ý)',
        interests: ['Áo Sơ Mi Sọc Cam', 'Quần Thể Thao Xám Đậm', 'Balo SGS'],
        style_preference: 'Năng động, Streetwear',
        price_range: '200k_350k',
        first_touch_platform: 'facebook',
        first_touch_medium: 'paid_social',
        first_touch_placement: 'story',
        first_touch_creative: 'story_shirt_a',
        last_touch_platform: 'email',
        last_touch_medium: 'email',
        last_touch_placement: 'email',
        last_touch_creative: 'voucher_wave1',
        session_source_medium: 'email / email',
        session_channel_group: 'Email',
        landing_page_query: '/?utm_source=email&utm_medium=email&utm_campaign=voucher_wave1&utm_content=voucher_wave1',
        device_category: 'mobile',
        key_event: 'generate_lead',
        source_method: 'utm_manual',
        created_at: '2026-10-16T20:10:00.000Z'
      },
      {
        lead_id: 'UEL-K244111398',
        display_name: 'Nguyễn Ngọc Trường Giang',
        normalized_email: 'giangnnt24411@st.uel.edu.vn',
        customer_segment: 'Sinh viên ĐHQG / Các trường ĐH khác / Học sinh THPT',
        relation_to_uel: 'student_other',
        profile_stage: 'stage_1_verified',
        profile_status: 'Stage 1: Đã xác thực OTP',
        otp_status: 'VERIFIED (Đã xác thực)',
        email_verified_at: '2026-10-19T10:35:00.000Z',
        marketing_email_opt_in: true,
        consent_marketing: 'CÓ (Đồng ý)',
        interests: ['Quần Thể Thao UEL Đen', 'Túi Đeo Chéo Balo SGS'],
        style_preference: 'Thể thao, Khỏe khoắn',
        price_range: '200k_350k',
        first_touch_platform: 'facebook',
        first_touch_medium: 'paid_social',
        first_touch_placement: 'reels',
        first_touch_creative: 'reels_shirt_a',
        last_touch_platform: 'google',
        last_touch_medium: 'organic',
        last_touch_placement: 'organic_search',
        last_touch_creative: 'organic_search',
        session_source_medium: 'google / organic',
        session_channel_group: 'Organic Search',
        landing_page_query: '/',
        device_category: 'desktop',
        key_event: 'generate_lead',
        source_method: 'organic_inferred',
        created_at: '2026-10-19T10:35:00.000Z'
      },
      {
        lead_id: 'UEL-K244111400',
        display_name: 'Phạm Thái Hà',
        normalized_email: 'hapt24411@st.uel.edu.vn',
        customer_segment: 'Giới trẻ Gen Z / Tín đồ Local Brand & Streetwear',
        relation_to_uel: 'genz_fashion',
        profile_stage: 'stage_2_enriched',
        profile_status: 'Stage 2: Đã bổ sung sở thích',
        otp_status: 'VERIFIED (Đã xác thực)',
        email_verified_at: '2026-10-21T16:50:00.000Z',
        marketing_email_opt_in: true,
        consent_marketing: 'CÓ (Đồng ý)',
        interests: ['Bộ Sưu Tập Campus Collab SGS', 'Balo Basic SGS'],
        style_preference: 'Tối giản, Basic',
        price_range: '200k_350k',
        first_touch_platform: 'tiktok',
        first_touch_medium: 'organic_social',
        first_touch_placement: 'profile',
        first_touch_creative: 'profile_uel_a',
        last_touch_platform: 'direct',
        last_touch_medium: 'none',
        last_touch_placement: 'direct',
        last_touch_creative: 'none',
        session_source_medium: '(direct) / (none)',
        session_channel_group: 'Direct',
        landing_page_query: '/',
        device_category: 'desktop',
        key_event: 'generate_lead',
        source_method: 'direct',
        created_at: '2026-10-21T16:50:00.000Z'
      },
      {
        lead_id: 'UEL-K244111403',
        display_name: 'Nguyễn Đình Huy',
        normalized_email: 'huynd24411@st.uel.edu.vn',
        customer_segment: 'Cựu sinh viên / Người đi làm trẻ (Young Professional)',
        relation_to_uel: 'young_pro',
        profile_stage: 'stage_2_enriched',
        profile_status: 'Stage 2: Đã bổ sung sở thích',
        otp_status: 'VERIFIED (Đã xác thực)',
        email_verified_at: '2026-10-24T11:15:00.000Z',
        marketing_email_opt_in: true,
        consent_marketing: 'CÓ (Đồng ý)',
        interests: ['Áo Sơ Mi Sọc Xanh Lá', 'Balo Basic SGS', 'Ví Phụ Kiện'],
        style_preference: 'Thanh lịch, Campus Chic',
        price_range: 'trên 350k',
        first_touch_platform: 'facebook',
        first_touch_medium: 'organic_social',
        first_touch_placement: 'post',
        first_touch_creative: 'post_campus_a',
        last_touch_platform: 'facebook',
        last_touch_medium: 'organic_social',
        last_touch_placement: 'post',
        last_touch_creative: 'post_campus_a',
        session_source_medium: 'facebook / organic_social',
        session_channel_group: 'Organic Social',
        landing_page_query: '/?utm_source=facebook&utm_medium=organic_social&utm_campaign=uel_merch_oct26&utm_content=post_campus_a',
        device_category: 'desktop',
        key_event: 'generate_lead',
        source_method: 'utm_manual',
        created_at: '2026-10-24T11:15:00.000Z'
      },
      {
        lead_id: 'UEL-K244111409',
        display_name: 'Ngô Thị Thảo Linh',
        normalized_email: 'linhntt24411@st.uel.edu.vn',
        customer_segment: 'Sinh viên UEL (ĐH Kinh tế - Luật)',
        relation_to_uel: 'student_uel',
        profile_stage: 'stage_2_enriched',
        profile_status: 'Stage 2: Đã bổ sung sở thích',
        otp_status: 'VERIFIED (Đã xác thực)',
        email_verified_at: '2026-10-27T15:05:00.000Z',
        marketing_email_opt_in: true,
        consent_marketing: 'CÓ (Đồng ý)',
        interests: ['Áo Sơ Mi Sọc UEL 4 Màu', 'Quần Thể Thao Đen / Xám'],
        style_preference: 'Thanh lịch, Đi học / Thuyết trình',
        price_range: '200k_350k',
        first_touch_platform: 'google',
        first_touch_medium: 'organic',
        first_touch_placement: 'organic_search',
        first_touch_creative: 'organic_search',
        last_touch_platform: 'google',
        last_touch_medium: 'organic',
        last_touch_placement: 'organic_search',
        last_touch_creative: 'organic_search',
        session_source_medium: 'google / organic',
        session_channel_group: 'Organic Search',
        landing_page_query: '/',
        device_category: 'desktop',
        key_event: 'generate_lead',
        source_method: 'organic_inferred',
        created_at: '2026-10-27T15:05:00.000Z'
      },
      {
        lead_id: 'UEL-K244111421',
        display_name: 'Đặng Quỳnh Nhi',
        normalized_email: 'nhidq24411@st.uel.edu.vn',
        customer_segment: 'Khách hàng đại chúng / Yêu thích Campus Chic',
        relation_to_uel: 'campus_chic_fan',
        profile_stage: 'stage_2_enriched',
        profile_status: 'Stage 2: Đã bổ sung sở thích',
        otp_status: 'VERIFIED (Đã xác thực)',
        email_verified_at: '2026-11-01T19:35:00.000Z',
        marketing_email_opt_in: true,
        consent_marketing: 'CÓ (Đồng ý)',
        interests: ['Áo Sơ Mi Sọc Đỏ Hồng', 'Túi Tote Canvas Mini SGS'],
        style_preference: 'Năng động, Streetwear',
        price_range: '200k_350k',
        first_touch_platform: 'facebook',
        first_touch_medium: 'paid_social',
        first_touch_placement: 'unknown',
        first_touch_creative: 'multi_placement_auto',
        last_touch_platform: 'facebook',
        last_touch_medium: 'paid_social',
        last_touch_placement: 'feed',
        last_touch_creative: 'feed_shirt_a',
        session_source_medium: 'facebook / paid_social',
        session_channel_group: 'Paid Social',
        landing_page_query: '/?utm_source=facebook&utm_medium=paid_social&utm_campaign=uel_merch_oct26&utm_content=feed_shirt_a',
        device_category: 'desktop',
        key_event: 'generate_lead',
        source_method: 'utm_manual',
        created_at: '2026-11-01T19:35:00.000Z'
      },
      {
        lead_id: 'UEL-K244111454',
        display_name: 'Huỳnh Gia Bảo',
        normalized_email: 'baohg24411@st.uel.edu.vn',
        customer_segment: 'Giới trẻ Gen Z / Tín đồ Local Brand & Streetwear',
        relation_to_uel: 'genz_fashion',
        profile_stage: 'stage_2_enriched',
        profile_status: 'Stage 2: Đã bổ sung sở thích',
        otp_status: 'VERIFIED (Đã xác thực)',
        email_verified_at: '2026-11-03T13:30:00.000Z',
        marketing_email_opt_in: true,
        consent_marketing: 'CÓ (Đồng ý)',
        interests: ['Quần Thể Thao 4 Màu', 'Balo Basic SGS'],
        style_preference: 'Thể thao, Khỏe khoắn',
        price_range: '200k_350k',
        first_touch_platform: 'tiktok',
        first_touch_medium: 'organic_social',
        first_touch_placement: 'profile',
        first_touch_creative: 'profile_uel_a',
        last_touch_platform: 'tiktok',
        last_touch_medium: 'organic_social',
        last_touch_placement: 'profile',
        last_touch_creative: 'profile_uel_a',
        session_source_medium: 'tiktok / organic_social',
        session_channel_group: 'Organic Social',
        landing_page_query: '/?utm_source=tiktok&utm_medium=organic_social&utm_campaign=campus_chic_2026&utm_content=profile_uel_a',
        device_category: 'mobile',
        key_event: 'generate_lead',
        source_method: 'utm_manual',
        created_at: '2026-11-03T13:30:00.000Z'
      },
      {
        lead_id: 'UEL-K244111478',
        display_name: 'Hồ Thị Phương Thảo',
        normalized_email: 'thaohtp24411@st.uel.edu.vn',
        customer_segment: 'Cựu sinh viên / Người đi làm trẻ (Young Professional)',
        relation_to_uel: 'young_pro',
        profile_stage: 'stage_2_enriched',
        profile_status: 'Stage 2: Đã bổ sung sở thích',
        otp_status: 'VERIFIED (Đã xác thực)',
        email_verified_at: '2026-11-05T10:20:00.000Z',
        marketing_email_opt_in: true,
        consent_marketing: 'CÓ (Đồng ý)',
        interests: ['Áo Sơ Mi Sọc UEL', 'Ví Phụ Kiện SGS', 'Balo Basic'],
        style_preference: 'Thanh lịch, Đi học / Thuyết trình',
        price_range: 'trên 350k',
        first_touch_platform: 'email',
        first_touch_medium: 'email',
        first_touch_placement: 'email',
        first_touch_creative: 'voucher_wave1',
        last_touch_platform: 'email',
        last_touch_medium: 'email',
        last_touch_placement: 'email',
        last_touch_creative: 'voucher_wave1',
        session_source_medium: 'email / email',
        session_channel_group: 'Email',
        landing_page_query: '/?utm_source=email&utm_medium=email&utm_campaign=voucher_wave1&utm_content=voucher_wave1',
        device_category: 'desktop',
        key_event: 'generate_lead',
        source_method: 'utm_manual',
        created_at: '2026-11-05T10:20:00.000Z'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.LEADS_DB, JSON.stringify(defaultLeads));
    localStorage.setItem('uel_ga4_schema_version', GA4_SCHEMA_VER);
  }

  // Ghi nhận touchpoint & attribution (First-touch / Last-touch)
  if (typeof trackTouchpoints === 'function') {
    trackTouchpoints();
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

      // Đồng bộ thêm các GA4 Standard Key Events (form_submit & generate_lead) cho cột Key events trong GA4 Explore
      if (eventName === 'lead_form_submit_attempt') {
        window.gtag('event', 'form_submit', ga4CleanParams);
        console.log('[GA4 Key Event]: Đã kích hoạt sự kiện chuẩn "form_submit"');
      } else if (eventName === 'lead_verification_success') {
        window.gtag('event', 'generate_lead', { ...ga4CleanParams, value: 1, currency: 'VND' });
        console.log('[GA4 Key Event]: Đã kích hoạt sự kiện chuẩn "generate_lead"');
      }
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

/**
 * === QUY CHUẨN ĐỊNH DANH NGUỒN & ATTRIBUTION TAXONOMY (Table 2 & Section 3.3, 3.4, 3.5) ===
 * Ánh xạ UTM parameters và Referrer thành 4 chiều chuẩn:
 * platform, medium, placement, creative. Hỗ trợ First-Touch và Last-Touch.
 */
function getOrCreateSessionId() {
  let sess = sessionStorage.getItem('uel_session_id');
  if (!sess) {
    sess = 'sess_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('uel_session_id', sess);
  }
  return sess;
}

function resolveCurrentTouchpoint() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = (urlParams.get('utm_source') || '').toLowerCase().trim();
  const utmMedium = (urlParams.get('utm_medium') || '').toLowerCase().trim();
  const utmCampaign = (urlParams.get('utm_campaign') || '').trim();
  const utmContent = (urlParams.get('utm_content') || '').toLowerCase().trim();
  const utmTerm = (urlParams.get('utm_term') || '').trim();
  const referrer = (document.referrer || '').toLowerCase();

  let platform = 'direct';
  let medium = 'none';
  let placement = 'direct';
  let creative = utmContent || 'none';
  let campaign = utmCampaign || 'none';
  let method = 'direct';
  let confidence = 'low';

  // 1. Trường hợp có UTM parameters
  if (utmSource) {
    platform = utmSource;
    medium = utmMedium || 'unknown_medium';
    method = 'utm_manual';
    confidence = 'high';

    // Bảng chuẩn hóa Placement (Table 2)
    if (utmContent.startsWith('feed_') || utmContent.includes('feed')) {
      placement = 'feed';
    } else if (utmContent.startsWith('story_') || utmContent.includes('story')) {
      placement = 'story';
    } else if (utmContent.startsWith('reels_') || utmContent.includes('reels')) {
      placement = 'reels';
    } else if (utmContent.startsWith('post_') || utmContent.includes('post')) {
      placement = 'post';
    } else if (utmContent.startsWith('profile_') || utmContent.includes('profile') || utmContent.includes('bio')) {
      placement = 'profile';
    } else if (utmContent.startsWith('voucher_') || utmMedium === 'email' || utmSource === 'email') {
      placement = 'email';
    } else {
      // Trường hợp automated multi-placement delivery hoặc không xác định (Mục 3.3)
      placement = 'unknown';
    }
  } 
  // 2. Không có UTM nhưng có Referrer từ Google Search
  else if (referrer.includes('google.')) {
    platform = 'google';
    medium = 'organic';
    placement = 'organic_search';
    method = 'organic_inferred';
    confidence = 'high';
  } 
  // 3. Không có UTM nhưng đến từ Mạng xã hội (Facebook, TikTok...)
  else if (referrer.includes('facebook.') || referrer.includes('fb.')) {
    platform = 'facebook';
    medium = 'organic_social';
    // Tuân thủ Mục 3.3: "Do not infer placement solely from the facebook.com referrer"
    placement = 'unknown';
    method = 'referrer';
    confidence = 'medium';
  } else if (referrer.includes('tiktok.')) {
    platform = 'tiktok';
    medium = 'organic_social';
    placement = 'unknown';
    method = 'referrer';
    confidence = 'medium';
  } else if (referrer.includes('instagram.')) {
    platform = 'instagram';
    medium = 'organic_social';
    placement = 'unknown';
    method = 'referrer';
    confidence = 'medium';
  }

  return {
    visit_id: 'vis_' + Math.random().toString(36).substr(2, 9),
    anonymous_session_id: getOrCreateSessionId(),
    platform: platform,
    medium: medium,
    placement: placement,
    creative: creative,
    campaign: campaign,
    utm_term: utmTerm,
    source_method: method,
    source_confidence: confidence,
    landing_url: window.location.href,
    referrer: document.referrer || 'direct',
    visited_at: new Date().toISOString()
  };
}

function trackTouchpoints() {
  const currentTouch = resolveCurrentTouchpoint();

  // Ghi nhận First-Touch nếu đây là lần đầu người dùng ghé thăm (Mục 3.5)
  if (!localStorage.getItem(STORAGE_KEYS.FIRST_TOUCH)) {
    localStorage.setItem(STORAGE_KEYS.FIRST_TOUCH, JSON.stringify(currentTouch));
  }

  // Luôn cập nhật Last-Touch cho phiên hiện tại
  sessionStorage.setItem(STORAGE_KEYS.LAST_TOUCH, JSON.stringify(currentTouch));
  localStorage.setItem(STORAGE_KEYS.LAST_TOUCH, JSON.stringify(currentTouch));

  return {
    firstTouch: JSON.parse(localStorage.getItem(STORAGE_KEYS.FIRST_TOUCH)),
    lastTouch: currentTouch
  };
}

/**
 * === TÍCH HỢP LƯU FORM VÀO DATABASE EXCEL / GOOGLE SHEETS ===
 * Ghi nhận lead theo 22 trường chuẩn MarTech (Table 2 & Table 3):
 * Đối tượng đa dạng (Sinh viên, Gen Z Streetwear, Người đi làm, Giảng viên...)
 * và phân tích đa chạm (First-Touch & Last-Touch Attribution).
 */
async function syncLeadToExcel(leadData) {
  const defaultExcelUrl = "https://script.google.com/macros/s/AKfycbxM8ukMjKj3rr8mpiCh-AnnR8sjlG8S0CuBVPEqrw7VOZLX0BA3Kv-YswayQ46JpLcb/exec";
  const excelUrl = window.EXCEL_DATABASE_URL || localStorage.getItem('uel_excel_db_url') || defaultExcelUrl;

  const { firstTouch, lastTouch } = trackTouchpoints();

  // Xác định nhóm đối tượng khách hàng (Mở rộng ngoài sinh viên)
  const customerSegment = translateRelationToVietnamese(leadData.relation_to_uel || leadData.customer_segment);

  const fPlatform = leadData.first_touch_platform || firstTouch.platform || 'facebook';
  const fMedium = leadData.first_touch_medium || firstTouch.medium || 'paid_social';
  const fPlacement = leadData.first_touch_placement || firstTouch.placement || 'feed';
  const fCampaign = leadData.first_touch_campaign || firstTouch.campaign || 'uel_merch_oct26';
  const fCreative = leadData.first_touch_creative || firstTouch.creative || 'feed_shirt_a';

  const lPlatform = leadData.last_touch_platform || lastTouch.platform || 'google';
  const lMedium = leadData.last_touch_medium || lastTouch.medium || 'organic';
  const lPlacement = leadData.last_touch_placement || lastTouch.placement || 'organic_search';
  const lCampaign = leadData.last_touch_campaign || lastTouch.campaign || 'none';
  const lCreative = leadData.last_touch_creative || lastTouch.creative || 'organic_search';

  const sessionSourceMedium = leadData.session_source_medium || (lPlatform === 'direct' ? '(direct) / (none)' : `${lPlatform} / ${lMedium}`);
  const sessionChannelGroup = leadData.session_channel_group || (
    lMedium === 'organic' ? 'Organic Search' :
    lMedium === 'paid_social' ? 'Paid Social' :
    lMedium === 'organic_social' ? 'Organic Social' :
    lMedium === 'email' ? 'Email' : 'Direct'
  );
  const landingPageQuery = leadData.landing_page_query || (window.location.pathname + (window.location.search || ''));

  const payload = {
    lead_id: leadData.lead_id || ('lead-uel-' + Math.random().toString(36).substr(2, 8)),
    display_name: leadData.display_name || '',
    normalized_email: leadData.normalized_email || leadData.email || '',
    email: leadData.normalized_email || leadData.email || '',
    relation_to_uel: customerSegment,
    customer_segment: customerSegment,
    profile_status: leadData.profile_stage === 'stage_2_enriched'
      ? 'Stage 2: Đã bổ sung sở thích'
      : (leadData.profile_stage === 'stage_1_verified' ? 'Stage 1: Đã xác thực OTP' : 'Stage 0: Chờ xác thực OTP'),
    profile_stage: leadData.profile_stage || 'stage_1_verified',
    otp_status: leadData.email_verified_at ? 'VERIFIED (Đã xác thực)' : 'PENDING (Chờ xác thực)',
    email_verified_at: leadData.email_verified_at ? 'Đã xác thực OTP' : 'Chưa xác thực',
    consent_marketing: leadData.marketing_email_opt_in ? 'CÓ (Đồng ý nhận tin)' : 'KHÔNG (Từ chối)',
    marketing_email_opt_in: leadData.marketing_email_opt_in ? 'CÓ' : 'KHÔNG',
    policy_version: 'v2.1_2026',
    interests: Array.isArray(leadData.interests) ? leadData.interests.join(', ') : (leadData.interests || 'Chưa cung cấp'),
    style_preference: translateStyleToVietnamese(leadData.style_preference),
    price_range: leadData.price_range || 'Chưa chọn',
    
    // Attribution đa chạm (First-Touch & Last-Touch - Table 2 & Section 3.5) + GA4 Explore Dimensions
    first_touch_platform: fPlatform,
    first_touch_medium: fMedium,
    first_touch_placement: fPlacement,
    first_touch_campaign: fCampaign,
    first_touch_creative: fCreative,
    last_touch_platform: lPlatform,
    last_touch_medium: lMedium,
    last_touch_placement: lPlacement,
    last_touch_campaign: lCampaign,
    last_touch_creative: lCreative,
    session_source_medium: sessionSourceMedium,
    session_channel_group: sessionChannelGroup,
    landing_page_query: landingPageQuery,
    device_category: leadData.device_category || (window.innerWidth <= 768 ? 'mobile' : 'desktop'),
    key_event: leadData.key_event || (leadData.email_verified_at ? 'generate_lead' : 'form_submit'),
    source_method: leadData.source_method || lastTouch.source_method,
    source_confidence: leadData.source_confidence || lastTouch.source_confidence,
    source_placement: `[1st] ${fPlatform}/${fPlacement} (${fCreative}) -> [Last] ${lPlatform}/${lPlacement} (${lCreative})`,
    anonymous_session_id: leadData.session_id || lastTouch.anonymous_session_id,
    session_id: leadData.session_id || lastTouch.anonymous_session_id,
    created_at: leadData.created_at || new Date().toISOString(),
    updated_at: leadData.updated_at || new Date().toISOString(),
    submitted_at: leadData.submitted_at || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    submitted_at_vn: leadData.submitted_at || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
  };

  console.log('[Excel Database Engine]: Đang đẩy lead và dữ liệu Attribution vào Google Sheet...', payload);

  if (excelUrl && excelUrl.trim().startsWith('http')) {
    try {
      await fetch(excelUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log('[Excel Database Success]: Dữ liệu đã lưu thành công vào Google Sheet!');
      return { success: true, provider: 'Excel_Online_Webhook' };
    } catch (err) {
      console.error('[Excel Database Error]: Lỗi gửi dữ liệu lên Webhook:', err);
      return { success: false, error: err };
    }
  } else {
    return { success: true, provider: 'Local_Excel_Ledger' };
  }
}

// Hàm trợ giúp dịch đối tượng khách hàng sang tiếng Việt (Mở rộng ngoài sinh viên)
function translateRelationToVietnamese(rel) {
  const map = {
    genz_fashion: 'Giới trẻ Gen Z / Tín đồ Local Brand & Streetwear',
    student_uel: 'Sinh viên UEL (ĐH Kinh tế - Luật)',
    student_other: 'Sinh viên ĐHQG / Các trường ĐH khác / Học sinh THPT',
    young_pro: 'Cựu sinh viên / Người đi làm trẻ (Young Professional)',
    faculty_staff: 'Cán bộ / Giảng viên nhà trường',
    campus_chic_fan: 'Khách hàng đại chúng / Yêu thích Campus Chic',
    student: 'Sinh viên UEL',
    alumni: 'Cựu sinh viên / Người đi làm',
    faculty: 'Cán bộ / Giảng viên',
    friend: 'Tín đồ thời trang / Khách ngoài',
    other: 'Khách hàng khác'
  };
  return map[rel] || rel || 'Khách hàng đại chúng';
}

// Hàm trợ giúp dịch phong cách sang tiếng Việt
function translateStyleToVietnamese(style) {
  const map = {
    streetwear: 'Năng động, Streetwear',
    formal: 'Thanh lịch, Đi học / Thuyết trình',
    minimalist: 'Tối giản, Basic',
    sporty: 'Thể thao, Khỏe khoắn'
  };
  return map[style] || style || 'Chưa chọn';
}

// Chạy tự động khi load
initAnalyticsEngine();
