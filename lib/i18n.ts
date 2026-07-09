import { cookies } from "next/headers";

/**
 * Trilingual INTERFACE translation (English / Kannada / Hindi).
 *
 * IMPORTANT: this module is SERVER-ONLY (it imports `next/headers`). Never
 * import it from a "use client" component — pass the resolved `lang` and/or
 * already-translated strings down as props from a server parent instead
 * (see components/LanguageSwitcher.tsx, components/ViewToggle.tsx,
 * components/Lightbox.tsx, components/admin/ProjectPhotos.tsx for the
 * pattern). `lib/format.ts` keeps its own small translation table for the
 * same reason — it is imported by client components (ProjectGrid).
 *
 * This dictionary covers UI chrome only (menus, buttons, headings, labels,
 * table headers, messages) — never the owner's content data stored in
 * data/content.json (project titles/descriptions/etc. are rendered as-is).
 */
export type Lang = "en" | "kn" | "hi";

const LANG_COOKIE = "lang";

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  kn: "ಕನ್ನಡ",
  hi: "हिंदी",
};

const dict: Record<string, Record<Lang, string>> = {
  // ---------- public nav / header / footer ----------
  nav_home: { en: "Home", kn: "ಮುಖಪುಟ", hi: "होम" },
  nav_projects: { en: "Our Work", kn: "ನಮ್ಮ ಕೆಲಸಗಳು", hi: "हमारा काम" },
  nav_about: { en: "About", kn: "ನಮ್ಮ ಬಗ್ಗೆ", hi: "हमारे बारे में" },
  nav_awards: { en: "Awards", kn: "ಪ್ರಶಸ್ತಿಗಳು", hi: "पुरस्कार" },
  nav_contact: { en: "Contact", kn: "ಸಂಪರ್ಕ", hi: "संपर्क" },
  cta_view_work: { en: "View our work", kn: "ನಮ್ಮ ಕೆಲಸ ನೋಡಿ", hi: "हमारा काम देखें" },
  call: { en: "Call", kn: "ಕರೆ ಮಾಡಿ", hi: "कॉल करें" },
  whatsapp: { en: "WhatsApp", kn: "ವಾಟ್ಸ್‌ಆ್ಯಪ್", hi: "व्हाट्सएप" },
  view_web: { en: "Web", kn: "ವೆಬ್", hi: "वेब" },
  view_mobile: { en: "Mobile", kn: "ಮೊಬೈಲ್", hi: "मोबाइल" },
  preview_site_layout: {
    en: "Preview site layout",
    kn: "ಸೈಟ್ ವಿನ್ಯಾಸ ಪೂರ್ವವೀಕ್ಷಣೆ",
    hi: "साइट लेआउट पूर्वावलोकन",
  },
  preview_web_layout: {
    en: "Preview web layout",
    kn: "ವೆಬ್ ವಿನ್ಯಾಸ ಪೂರ್ವವೀಕ್ಷಣೆ",
    hi: "वेब लेआउट पूर्वावलोकन",
  },
  preview_mobile_layout: {
    en: "Preview mobile layout",
    kn: "ಮೊಬೈಲ್ ವಿನ್ಯಾಸ ಪೂರ್ವವೀಕ್ಷಣೆ",
    hi: "मोबाइल लेआउट पूर्वावलोकन",
  },

  // ---------- project types ----------
  type_temple: { en: "Temple", kn: "ದೇವಸ್ಥಾನ", hi: "मंदिर" },
  type_pond: { en: "Pond", kn: "ಕೊಳ", hi: "तालाब" },
  type_gopura: { en: "Gopura", kn: "ಗೋಪುರ", hi: "गोपुर" },
  type_renovation: { en: "Renovation", kn: "ಜೀರ್ಣೋದ್ಧಾರ", hi: "जीर्णोद्धार" },
  type_other: { en: "Other", kn: "ಇತರೆ", hi: "अन्य" },

  // ---------- project facts / detail page ----------
  built_for: { en: "Built for", kn: "ಯಾರಿಗಾಗಿ", hi: "किसके लिए" },
  materials: { en: "Materials", kn: "ಸಾಮಗ್ರಿಗಳು", hi: "सामग्री" },
  duration: { en: "Duration", kn: "ಅವಧಿ", hi: "अवधि" },
  team_size: { en: "Team size", kn: "ತಂಡದ ಗಾತ್ರ", hi: "टीम का आकार" },
  led_by: { en: "Led by", kn: "ನೇತೃತ್ವ", hi: "नेतृत्व" },
  status: { en: "Status", kn: "ಸ್ಥಿತಿ", hi: "स्थिति" },
  before_after: { en: "Before & After", kn: "ಮೊದಲು ಮತ್ತು ನಂತರ", hi: "पहले और बाद में" },
  before: { en: "Before", kn: "ಮೊದಲು", hi: "पहले" },
  after: { en: "After", kn: "ನಂತರ", hi: "बाद में" },
  watch_video: { en: "Watch video", kn: "ವೀಡಿಯೊ ನೋಡಿ", hi: "वीडियो देखें" },
  view_location: { en: "View location", kn: "ಸ್ಥಳ ನೋಡಿ", hi: "स्थान देखें" },
  given_by: { en: "Given by", kn: "ನೀಡಿದವರು", hi: "द्वारा दिया गया" },

  // ---------- generic actions ----------
  login: { en: "Log in", kn: "ಲಾಗಿನ್", hi: "लॉग इन" },
  password: { en: "Password", kn: "ಪಾಸ್‌ವರ್ಡ್", hi: "पासवर्ड" },
  logout: { en: "Logout", kn: "ಲಾಗ್ ಔಟ್", hi: "लॉग आउट" },
  save: { en: "Save", kn: "ಉಳಿಸಿ", hi: "सहेजें" },
  cancel: { en: "Cancel", kn: "ರದ್ದುಮಾಡಿ", hi: "रद्द करें" },
  delete: { en: "Delete", kn: "ಅಳಿಸಿ", hi: "हटाएँ" },
  edit: { en: "Edit", kn: "ಸಂಪಾದಿಸಿ", hi: "संपादित करें" },
  yes: { en: "Yes", kn: "ಹೌದು", hi: "हाँ" },

  // ---------- admin nav ----------
  admin_dashboard: { en: "Dashboard", kn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", hi: "डैशबोर्ड" },
  admin_projects: { en: "Our Work", kn: "ನಮ್ಮ ಕೆಲಸಗಳು", hi: "हमारा काम" },
  admin_awards: { en: "Awards", kn: "ಪ್ರಶಸ್ತಿಗಳು", hi: "पुरस्कार" },
  admin_testimonials: { en: "Testimonials", kn: "ಅಭಿಪ್ರಾಯಗಳು", hi: "प्रशंसापत्र" },
  admin_about: { en: "About", kn: "ನಮ್ಮ ಬಗ್ಗೆ", hi: "हमारे बारे में" },
  admin_settings: { en: "Site info", kn: "ಸೈಟ್ ಮಾಹಿತಿ", hi: "साइट जानकारी" },
  admin_services: { en: "Services", kn: "ಸೇವೆಗಳು", hi: "सेवाएँ" },
  admin_suffix: { en: "Admin", kn: "ಆಡಳಿತ", hi: "एडमिन" },

  // ---------- shared form field labels ----------
  year_completed: { en: "Year completed", kn: "ಪೂರ್ಣಗೊಂಡ ವರ್ಷ", hi: "पूर्ण होने का वर्ष" },
  add_images: { en: "Add images", kn: "ಚಿತ್ರಗಳನ್ನು ಸೇರಿಸಿ", hi: "छवियाँ जोड़ें" },
  title: { en: "Title", kn: "ಶೀರ್ಷಿಕೆ", hi: "शीर्षक" },
  type_label: { en: "Type", kn: "ಪ್ರಕಾರ", hi: "प्रकार" },
  place: { en: "Place", kn: "ಸ್ಥಳ", hi: "स्थान" },
  description: { en: "Description", kn: "ವಿವರಣೆ", hi: "विवरण" },
  not_set: { en: "— Not set —", kn: "— ಹೊಂದಿಸಿಲ್ಲ —", hi: "— सेट नहीं है —" },
  comma_separated: {
    en: "(comma separated)",
    kn: "(ಅಲ್ಪವಿರಾಮದಿಂದ ಬೇರ್ಪಡಿಸಿ)",
    hi: "(अल्पविराम से अलग करें)",
  },
  map_link: { en: "Location map link", kn: "ಸ್ಥಳ ನಕ್ಷೆ ಲಿಂಕ್", hi: "स्थान मानचित्र लिंक" },
  video_link: { en: "Video link", kn: "ವೀಡಿಯೊ ಲಿಂಕ್", hi: "वीडियो लिंक" },
  before_after_photos: {
    en: "Before / after photos (optional)",
    kn: "ಮೊದಲು / ನಂತರದ ಫೋಟೋಗಳು (ಐಚ್ಛಿಕ)",
    hi: "पहले / बाद की तस्वीरें (वैकल्पिक)",
  },
  before_photo: { en: "Before photo", kn: "ಮೊದಲಿನ ಫೋಟೋ", hi: "पहले की तस्वीर" },
  after_photo: { en: "After photo", kn: "ನಂತರದ ಫೋಟೋ", hi: "बाद की तस्वीर" },
  remove_before_after: {
    en: "Remove before/after photos",
    kn: "ಮೊದಲು/ನಂತರದ ಫೋಟೋಗಳನ್ನು ತೆಗೆದುಹಾಕಿ",
    hi: "पहले/बाद की तस्वीरें हटाएँ",
  },
  feature_on_home: {
    en: "Feature this project on the home page",
    kn: "ಈ ಯೋಜನೆಯನ್ನು ಮುಖಪುಟದಲ್ಲಿ ತೋರಿಸಿ",
    hi: "इस परियोजना को होम पेज पर दिखाएँ",
  },
  current_photo: { en: "Current photo", kn: "ಪ್ರಸ್ತುತ ಫೋಟೋ", hi: "वर्तमान तस्वीर" },
  photo_label: { en: "Photo", kn: "ಫೋಟೋ", hi: "तस्वीर" },
  replace_photo: { en: "Replace photo", kn: "ಫೋಟೋ ಬದಲಾಯಿಸಿ", hi: "तस्वीर बदलें" },
  note_label: { en: "Note", kn: "ಟಿಪ್ಪಣಿ", hi: "टिप्पणी" },
  name_label: { en: "Name", kn: "ಹೆಸರು", hi: "नाम" },
  quote_label: { en: "Quote", kn: "ಉಲ್ಲೇಖ", hi: "उद्धरण" },
  role_label: { en: "Role", kn: "ಪಾತ್ರ", hi: "भूमिका" },
  year_label: { en: "Year", kn: "ವರ್ಷ", hi: "वर्ष" },

  // ---------- home page ----------
  section_our_work: { en: "Our Work", kn: "ನಮ್ಮ ಕೆಲಸ", hi: "हमारा काम" },
  section_about_us: { en: "About Us", kn: "ನಮ್ಮ ಬಗ್ಗೆ", hi: "हमारे बारे में" },
  read_more_about: {
    en: "Read more about us →",
    kn: "ನಮ್ಮ ಬಗ್ಗೆ ಇನ್ನಷ್ಟು ಓದಿ →",
    hi: "हमारे बारे में और पढ़ें →",
  },
  section_recognition: { en: "Recognition", kn: "ಮನ್ನಣೆ", hi: "सम्मान" },
  all_awards: { en: "All awards", kn: "ಎಲ್ಲಾ ಪ್ರಶಸ್ತಿಗಳು", hi: "सभी पुरस्कार" },
  section_testimonials: {
    en: "What Our Clients Say",
    kn: "ನಮ್ಮ ಗ್ರಾಹಕರ ಅಭಿಪ್ರಾಯ",
    hi: "हमारे ग्राहक क्या कहते हैं",
  },
  section_get_in_touch: { en: "Get in Touch", kn: "ಸಂಪರ್ಕದಲ್ಲಿರಿ", hi: "संपर्क में रहें" },
  contact_us_btn: { en: "Contact us", kn: "ಸಂಪರ್ಕಿಸಿ", hi: "संपर्क करें" },

  // ---------- projects listing ----------
  projects_heading: { en: "Our Work", kn: "ನಮ್ಮ ಕೆಲಸಗಳು", hi: "हमारा काम" },
  projects_subheading: {
    en: "Temples, ponds and gopuras built and restored across the region.",
    kn: "ಪ್ರದೇಶದಾದ್ಯಂತ ನಿರ್ಮಿಸಲಾದ ಮತ್ತು ಜೀರ್ಣೋದ್ಧಾರಗೊಳಿಸಲಾದ ದೇವಸ್ಥಾನಗಳು, ಕೊಳಗಳು ಮತ್ತು ಗೋಪುರಗಳು.",
    hi: "क्षेत्र भर में बनाए और जीर्णोद्धार किए गए मंदिर, तालाब और गोपुर।",
  },
  projects_empty: {
    en: "Projects will appear here soon.",
    kn: "ಯೋಜನೆಗಳು ಶೀಘ್ರದಲ್ಲೇ ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ.",
    hi: "परियोजनाएँ जल्द ही यहाँ दिखाई देंगी।",
  },
  filter_all: { en: "All", kn: "ಎಲ್ಲಾ", hi: "सभी" },

  // ---------- awards page ----------
  awards_heading: {
    en: "Awards & Recognition",
    kn: "ಪ್ರಶಸ್ತಿಗಳು ಮತ್ತು ಮನ್ನಣೆ",
    hi: "पुरस्कार और सम्मान",
  },
  awards_empty: {
    en: "Awards and recognitions will appear here.",
    kn: "ಪ್ರಶಸ್ತಿಗಳು ಮತ್ತು ಮನ್ನಣೆಗಳು ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ.",
    hi: "पुरस्कार और सम्मान यहाँ दिखाई देंगे।",
  },

  // ---------- about page ----------
  about: { en: "About", kn: "ನಮ್ಮ ಬಗ್ಗೆ", hi: "हमारे बारे में" },
  years_experience_suffix: {
    en: "years of experience",
    kn: "ವರ್ಷಗಳ ಅನುಭವ",
    hi: "वर्षों का अनुभव",
  },
  about_empty: {
    en: "More about us coming soon.",
    kn: "ನಮ್ಮ ಬಗ್ಗೆ ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಶೀಘ್ರದಲ್ಲೇ.",
    hi: "हमारे बारे में और जानकारी जल्द ही।",
  },
  section_what_we_do: { en: "What We Do", kn: "ನಾವು ಏನು ಮಾಡುತ್ತೇವೆ", hi: "हम क्या करते हैं" },

  // ---------- contact page ----------
  contact_heading: { en: "Contact Us", kn: "ಸಂಪರ್ಕಿಸಿ", hi: "संपर्क करें" },
  call_us: { en: "Call Us", kn: "ಕರೆ ಮಾಡಿ", hi: "कॉल करें" },
  whatsapp_blurb: {
    en: "Send us photos or details of your project.",
    kn: "ನಿಮ್ಮ ಯೋಜನೆಯ ಫೋಟೋಗಳು ಅಥವಾ ವಿವರಗಳನ್ನು ನಮಗೆ ಕಳುಹಿಸಿ.",
    hi: "अपनी परियोजना की तस्वीरें या विवरण हमें भेजें।",
  },
  chat_whatsapp: {
    en: "Chat on WhatsApp",
    kn: "ವಾಟ್ಸ್‌ಆ್ಯಪ್‌ನಲ್ಲಿ ಚಾಟ್ ಮಾಡಿ",
    hi: "व्हाट्सएप पर चैट करें",
  },
  email_label: { en: "Email", kn: "ಇಮೇಲ್", hi: "ईमेल" },
  send_email: { en: "Send email", kn: "ಇಮೇಲ್ ಕಳುಹಿಸಿ", hi: "ईमेल भेजें" },
  whatsapp_greeting: {
    en: "Hello {name}, I would like to know more about your work.",
    kn: "ನಮಸ್ಕಾರ {name}, ನಿಮ್ಮ ಕೆಲಸದ ಬಗ್ಗೆ ಇನ್ನಷ್ಟು ತಿಳಿಯಲು ಬಯಸುತ್ತೇನೆ.",
    hi: "नमस्ते {name}, मैं आपके काम के बारे में और जानना चाहता/चाहती हूँ।",
  },

  // ---------- 404 ----------
  not_found_heading: { en: "Page not found", kn: "ಪುಟ ಸಿಗಲಿಲ್ಲ", hi: "पृष्ठ नहीं मिला" },
  not_found_body: {
    en: "The page you are looking for may have moved or no longer exists.",
    kn: "ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟ ಸ್ಥಳಾಂತರಗೊಂಡಿರಬಹುದು ಅಥವಾ ಇನ್ನು ಅಸ್ತಿತ್ವದಲ್ಲಿ ಇಲ್ಲದಿರಬಹುದು.",
    hi: "आप जिस पृष्ठ को खोज रहे हैं वह स्थानांतरित हो गया होगा या अब मौजूद नहीं है।",
  },
  back_home: { en: "Back to home", kn: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ", hi: "होम पर वापस जाएँ" },

  // ---------- admin login ----------
  admin_login_heading: { en: "Admin Login", kn: "ಆಡಳಿತ ಲಾಗಿನ್", hi: "एडमिन लॉगिन" },
  admin_login_sub: {
    en: "Enter the admin password to continue.",
    kn: "ಮುಂದುವರಿಯಲು ಆಡಳಿತ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.",
    hi: "जारी रखने के लिए एडमिन पासवर्ड दर्ज करें।",
  },
  incorrect_password: {
    en: "Incorrect password. Please try again.",
    kn: "ತಪ್ಪಾದ ಪಾಸ್‌ವರ್ಡ್. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    hi: "गलत पासवर्ड। कृपया फिर से प्रयास करें।",
  },

  // ---------- admin dashboard ----------
  add_project: { en: "+ Add project", kn: "+ ಯೋಜನೆ ಸೇರಿಸಿ", hi: "+ परियोजना जोड़ें" },
  add_award: { en: "+ Add award", kn: "+ ಪ್ರಶಸ್ತಿ ಸೇರಿಸಿ", hi: "+ पुरस्कार जोड़ें" },
  add_testimonial: {
    en: "+ Add testimonial",
    kn: "+ ಅಭಿಪ್ರಾಯ ಸೇರಿಸಿ",
    hi: "+ प्रशंसापत्र जोड़ें",
  },
  view_public_site: {
    en: "View public site →",
    kn: "ಸಾರ್ವಜನಿಕ ಸೈಟ್ ನೋಡಿ →",
    hi: "सार्वजनिक साइट देखें →",
  },

  // ---------- admin projects ----------
  no_projects_yet: {
    en: "No projects yet.",
    kn: "ಇನ್ನೂ ಯಾವುದೇ ಯೋಜನೆಗಳಿಲ್ಲ.",
    hi: "अभी तक कोई परियोजना नहीं है।",
  },
  add_first_project: {
    en: "Add your first project",
    kn: "ನಿಮ್ಮ ಮೊದಲ ಯೋಜನೆಯನ್ನು ಸೇರಿಸಿ",
    hi: "अपनी पहली परियोजना जोड़ें",
  },
  details_col: { en: "Details", kn: "ವಿವರಗಳು", hi: "विवरण" },
  featured_col: {
    en: "Featured",
    kn: "ವೈಶಿಷ್ಟ್ಯಗೊಳಿಸಲಾಗಿದೆ",
    hi: "विशेष रूप से दिखाया गया",
  },
  confirm_delete_project: {
    en: 'Delete "{title}"? This cannot be undone.',
    kn: '"{title}" ಅನ್ನು ಅಳಿಸುವುದೇ? ಇದನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗುವುದಿಲ್ಲ.',
    hi: '"{title}" को हटाएँ? इसे वापस नहीं लाया जा सकता।',
  },
  back_to_projects: {
    en: "← Back to projects",
    kn: "← ಯೋಜನೆಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
    hi: "← परियोजनाओं पर वापस जाएँ",
  },
  edit_project: { en: "Edit Project", kn: "ಯೋಜನೆ ಸಂಪಾದಿಸಿ", hi: "परियोजना संपादित करें" },
  add_project_title: { en: "Add Project", kn: "ಯೋಜನೆ ಸೇರಿಸಿ", hi: "परियोजना जोड़ें" },
  save_changes: {
    en: "Save changes",
    kn: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    hi: "परिवर्तन सहेजें",
  },
  create_project: { en: "Create project", kn: "ಯೋಜನೆ ರಚಿಸಿ", hi: "परियोजना बनाएँ" },
  delete_this_project: {
    en: "Delete this project",
    kn: "ಈ ಯೋಜನೆಯನ್ನು ಅಳಿಸಿ",
    hi: "इस परियोजना को हटाएँ",
  },

  // ---------- admin awards ----------
  no_awards_yet: {
    en: "No awards yet.",
    kn: "ಇನ್ನೂ ಯಾವುದೇ ಪ್ರಶಸ್ತಿಗಳಿಲ್ಲ.",
    hi: "अभी तक कोई पुरस्कार नहीं है।",
  },
  add_first_award: {
    en: "Add your first award",
    kn: "ನಿಮ್ಮ ಮೊದಲ ಪ್ರಶಸ್ತಿಯನ್ನು ಸೇರಿಸಿ",
    hi: "अपना पहला पुरस्कार जोड़ें",
  },
  confirm_delete_award: {
    en: 'Delete "{title}"?',
    kn: '"{title}" ಅನ್ನು ಅಳಿಸುವುದೇ?',
    hi: '"{title}" को हटाएँ?',
  },
  back_to_awards: {
    en: "← Back to awards",
    kn: "← ಪ್ರಶಸ್ತಿಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
    hi: "← पुरस्कारों पर वापस जाएँ",
  },
  edit_award: { en: "Edit Award", kn: "ಪ್ರಶಸ್ತಿ ಸಂಪಾದಿಸಿ", hi: "पुरस्कार संपादित करें" },
  add_award_title: { en: "Add Award", kn: "ಪ್ರಶಸ್ತಿ ಸೇರಿಸಿ", hi: "पुरस्कार जोड़ें" },
  create_award: { en: "Create award", kn: "ಪ್ರಶಸ್ತಿ ರಚಿಸಿ", hi: "पुरस्कार बनाएँ" },
  delete_this_award: {
    en: "Delete this award",
    kn: "ಈ ಪ್ರಶಸ್ತಿಯನ್ನು ಅಳಿಸಿ",
    hi: "इस पुरस्कार को हटाएँ",
  },

  // ---------- admin testimonials ----------
  no_testimonials_yet: {
    en: "No testimonials yet.",
    kn: "ಇನ್ನೂ ಯಾವುದೇ ಅಭಿಪ್ರಾಯಗಳಿಲ್ಲ.",
    hi: "अभी तक कोई प्रशंसापत्र नहीं है।",
  },
  add_first_testimonial: {
    en: "Add your first testimonial",
    kn: "ನಿಮ್ಮ ಮೊದಲ ಅಭಿಪ್ರಾಯವನ್ನು ಸೇರಿಸಿ",
    hi: "अपना पहला प्रशंसापत्र जोड़ें",
  },
  quote_col: { en: "Quote", kn: "ಉಲ್ಲೇಖ", hi: "उद्धरण" },
  confirm_delete_testimonial: {
    en: 'Delete testimonial from "{name}"?',
    kn: '"{name}" ಅವರ ಅಭಿಪ್ರಾಯವನ್ನು ಅಳಿಸುವುದೇ?',
    hi: '"{name}" का प्रशंसापत्र हटाएँ?',
  },
  back_to_testimonials: {
    en: "← Back to testimonials",
    kn: "← ಅಭಿಪ್ರಾಯಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
    hi: "← प्रशंसापत्रों पर वापस जाएँ",
  },
  edit_testimonial: {
    en: "Edit Testimonial",
    kn: "ಅಭಿಪ್ರಾಯ ಸಂಪಾದಿಸಿ",
    hi: "प्रशंसापत्र संपादित करें",
  },
  add_testimonial_title: {
    en: "Add Testimonial",
    kn: "ಅಭಿಪ್ರಾಯ ಸೇರಿಸಿ",
    hi: "प्रशंसापत्र जोड़ें",
  },
  create_testimonial: {
    en: "Create testimonial",
    kn: "ಅಭಿಪ್ರಾಯ ರಚಿಸಿ",
    hi: "प्रशंसापत्र बनाएँ",
  },
  delete_this_testimonial: {
    en: "Delete this testimonial",
    kn: "ಈ ಅಭಿಪ್ರಾಯವನ್ನು ಅಳಿಸಿ",
    hi: "इस प्रशंसापत्र को हटाएँ",
  },

  // ---------- admin about / settings ----------
  saved: { en: "Saved.", kn: "ಉಳಿಸಲಾಗಿದೆ.", hi: "सहेजा गया।" },
  about_text_label: { en: "About text", kn: "ನಮ್ಮ ಬಗ್ಗೆ ಪಠ್ಯ", hi: "हमारे बारे में पाठ" },
  one_para_per_line: {
    en: "(one paragraph per line)",
    kn: "(ಒಂದು ಸಾಲಿಗೆ ಒಂದು ಪ್ಯಾರಾಗ್ರಾಫ್)",
    hi: "(प्रति पंक्ति एक अनुच्छेद)",
  },
  about_text_placeholder: {
    en: "Tell visitors about your work, your family tradition, your craftsmanship...",
    kn: "ನಿಮ್ಮ ಕೆಲಸ, ನಿಮ್ಮ ಕುಟುಂಬ ಪರಂಪರೆ, ನಿಮ್ಮ ಕರಕುಶಲತೆ ಬಗ್ಗೆ ಸಂದರ್ಶಕರಿಗೆ ತಿಳಿಸಿ...",
    hi: "आगंतुकों को अपने काम, अपनी पारिवारिक परंपरा, अपनी शिल्पकला के बारे में बताएँ...",
  },
  years_experience_label: {
    en: "Years of experience",
    kn: "ಅನುಭವದ ವರ್ಷಗಳು",
    hi: "अनुभव के वर्ष",
  },
  business_name: { en: "Business name", kn: "ವ್ಯಾಪಾರದ ಹೆಸರು", hi: "व्यवसाय का नाम" },
  tagline_label: { en: "Tagline", kn: "ಟ್ಯಾಗ್‌ಲೈನ್", hi: "टैगलाइन" },
  owners_label: { en: "Owners", kn: "ಮಾಲೀಕರು", hi: "मालिक" },
  phone_label: { en: "Phone", kn: "ಫೋನ್", hi: "फ़ोन" },
  whatsapp_number_label: {
    en: "WhatsApp number",
    kn: "ವಾಟ್ಸ್‌ಆ್ಯಪ್ ಸಂಖ್ಯೆ",
    hi: "व्हाट्सएप नंबर",
  },
  digits_with_country_code: {
    en: "(digits only, with country code)",
    kn: "(ಅಂಕಿಗಳು ಮಾತ್ರ, ದೇಶದ ಕೋಡ್‌ನೊಂದಿಗೆ)",
    hi: "(केवल अंक, देश कोड सहित)",
  },
  region_label: { en: "Region", kn: "ಪ್ರದೇಶ", hi: "क्षेत्र" },

  // ---------- lightbox (project photo viewer) ----------
  photo_view_full: {
    en: "View photo {n} of {total} full-screen",
    kn: "ಫೋಟೋ {n} ರಿಂದ {total} ಪೂರ್ಣ ಪರದೆಯಲ್ಲಿ ನೋಡಿ",
    hi: "तस्वीर {n} में से {total} पूर्ण स्क्रीन में देखें",
  },
  close_photo_viewer: {
    en: "Close photo viewer",
    kn: "ಫೋಟೋ ವೀಕ್ಷಕ ಮುಚ್ಚಿ",
    hi: "तस्वीर व्यूअर बंद करें",
  },
  previous_photo: { en: "Previous photo", kn: "ಹಿಂದಿನ ಫೋಟೋ", hi: "पिछली तस्वीर" },
  next_photo: { en: "Next photo", kn: "ಮುಂದಿನ ಫೋಟೋ", hi: "अगली तस्वीर" },
  photo_viewer_suffix: {
    en: "photo viewer",
    kn: "ಫೋಟೋ ವೀಕ್ಷಕ",
    hi: "तस्वीर व्यूअर",
  },

  // ---------- admin project photo manager ----------
  photos_label: { en: "Photos", kn: "ಫೋಟೋಗಳು", hi: "तस्वीरें" },
  add_remove_hint: {
    en: "(add or remove one at a time)",
    kn: "(ಒಂದೊಂದಾಗಿ ಸೇರಿಸಿ ಅಥವಾ ತೆಗೆದುಹಾಕಿ)",
    hi: "(एक-एक करके जोड़ें या हटाएँ)",
  },
  no_photos_yet: {
    en: "No photos yet.",
    kn: "ಇನ್ನೂ ಯಾವುದೇ ಫೋಟೋಗಳಿಲ್ಲ.",
    hi: "अभी तक कोई तस्वीर नहीं है।",
  },
  remove_photo_aria: {
    en: "Remove this photo",
    kn: "ಈ ಫೋಟೋವನ್ನು ತೆಗೆದುಹಾಕಿ",
    hi: "इस तस्वीर को हटाएँ",
  },
};

/**
 * Reads the visitor's language preference from the `lang` cookie. Falls
 * back to English ('en') if the cookie is absent or holds an unknown value.
 */
export async function getLang(): Promise<Lang> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LANG_COOKIE)?.value;
  if (value === "en" || value === "kn" || value === "hi") return value;
  return "en";
}

/**
 * Looks up `key` for `lang`, falling back to English and finally to the key
 * itself so a missing translation can never render as "undefined" or crash.
 * `vars`, if given, are interpolated into `{name}`-style placeholders.
 */
export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const entry = dict[key];
  let value = entry?.[lang] ?? entry?.en ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replaceAll(`{${k}}`, String(v));
    }
  }
  return value;
}
