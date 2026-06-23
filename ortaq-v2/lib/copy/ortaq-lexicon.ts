export const ORTAQ_COPY = {
  sections: {
    featuredDossiers: "Öne Çıkan Dosyalar",
    featuredDossierSpotlight: "Öne Çıkan Dosya",
    featuredEyebrow: "ÖNE ÇIKANLAR",
    archive: "Dosya Arşivi",
    standards: "Yayın Standardı",
    activeDossiers: "Aktif Dosyalar",
    pendingMatches: "Bekleyen Eşleşmeler",
    panelOverview: "Genel Bakış",
    myDossiers: "Fırsatlarım",
    recentActivity: "Son Aktivite",
    todo: "Yapılacaklar",
    dossierFlow: "Dosya akışı",
    browseDossiers: "Fırsatları İncele",
  },
  ctas: {
    createDossier: "Fırsat Dosyası Oluştur",
    browseDossiers: "Fırsatları İncele",
    viewDossier: "Dosyayı İncele",
    viewAll: "Tümünü Gör",
    goToPanel: "Panele Git",
    apply: "Başvuru Yap",
    manageDossier: "Dosyayı Yönet",
    completeProfile: "Profili Tamamla",
    viewMatches: "Eşleşmeleri Gör",
    createFirstDossier: "İlk Dosyanı Oluştur",
    backToArchive: "Arşive dön",
    browseOtherDossiers: "Diğer fırsatları incele",
  },
  badges: {
    featured: "Öne Çıkan",
    live: "Yayında",
    reviewing: "İncelemede",
    draft: "Taslak",
    rejected: "Reddedildi",
    reviewed: "İncelendi",
    new: "Yeni",
  },
  labels: {
    assets: "Varlık",
    gap: "Eksik",
    partnerNeeded: "Aranan Ortak",
    partnerNeed: "Ortak İhtiyacı",
    lastUpdate: "Son Güncelleme",
    dossierArchive: "Dosya Arşivi",
    dossierSummary: "Dosya Özeti",
    dossierDetail: "Dosya Detayı",
    review: "İnceleme",
    verification: "Doğrulama",
    publishCriteria: "Yayın Kriterleri",
    filter: "Filtrele",
    sort: "Sırala",
  },
  trust: {
    heroEyebrow: "Yapılandırılmış ortak eşleştirme",
    reviewedPublish: "İnceleme sonrası yayın",
    privacyProtected: "Gizlilik korumalı",
    verifiedProfiles: "Doğrulanmış profiller",
    trustFooter: "Yayın standardı · Gizlilik korumalı · Doğrulanmış profiller",
    platformTagline:
      "Varlığı olan fırsatları doğru ortaklarla buluşturan yapılandırılmış eşleştirme platformu.",
  },
  archive: {
    intro:
      "Varlık, eksik parça ve aranan ortak — her satır bir kayıt. Aktif dosyaları filtreleyin, karşılaştırın ve inceleyin.",
    featuredRailDescription:
      "İncelemeden geçmiş, varlık ve ortak ihtiyacı net tanımlanmış dosyalar.",
    sortFeaturedFirst: "Öne Çıkanlar Önce",
  },
  panel: {
    browseDescription:
      "Yayında olan fırsat dosyalarını inceleyin. Profiliniz ne kadar net olursa eşleşme kalitesi o kadar yükselir.",
    matchesEmptyPartner:
      "Yayında olan fırsat dosyalarını inceleyin. Uygun dosyalarda başvuru oluşturabilir veya platform önerilerini bekleyebilirsiniz.",
    browseLink: "Fırsat dosyalarını incele →",
    ownerEmptyDescription:
      "Varlığınızı, eksik parçayı ve aranan ortak türünü yapılandırılmış dosyaya dönüştürün. Dosyanız inceleme sonrası yayına alınır.",
    dossierEmptyDescription:
      "İlk dosyanızı oluşturun; varlık, eksik parça ve aranan ortak türü inceleme için yapılandırılır.",
    browseSectionTitle: "Fırsat inceleme",
    browseSectionDescription:
      "Aktif dosyaları inceleyin ve uygun eşleşmeleri takip edin.",
    profileCompletion: "Profil tamamlama",
  },
  dossier: {
    reviewPanelTitle: "ORTAQ incelemesi",
    reviewPanelDescription:
      "Bu dosya ORTAQ yayın standardına göre yapılandırılmıştır. Aşağıdaki doğrulama durumları inceleme sürecini yansıtır.",
    dossierReview: "Dosya incelemesi",
    applyPrompt: "Bu fırsata başvurmak ister misiniz?",
    applyLoginHint:
      "Başvuru için giriş yapın. Dosya sahibi yapılandırılmış başvurunuzu görür.",
    applyAuthenticatedHint:
      "Dosya sahibi varlık, eksik parça ve aradığı ortak türünü net görmüştür — katkınızı belirtin.",
    applicationSent: "Başvurunuz gönderildi",
    applicationSentHint:
      "Başvurunuz dosya sahibine iletildi. Eşleşme sürecini panelden takip edebilirsiniz.",
  },
  process: {
    reviewStepDescription:
      "İnceleme sonrası dosya yayına alınır veya geri bildirim verilir.",
  },
  standards: {
    reviewCriterion: "İnceleme",
    reviewCriterionDetail:
      "Her dosya yayın öncesi tutarlılık ve eşleşme uygunluğu açısından incelenir.",
    partnerNeedRejected:
      "Belirsiz ortak talepleri inceleme sürecinde elenir.",
  },
} as const;

export type OrtaqCopy = typeof ORTAQ_COPY;
