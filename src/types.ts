export interface Comic {
  id: string;
  title: string;
  description: string;
  author: string;
  rating: number;
  ratingCount: string;
  status: string;
  category: string;
  tags: string[];
  coverUrl: string;
  bannerUrl: string;
  chapters: Chapter[];
  progress?: number;
  isSaved?: boolean;
  userVote?: 'up' | 'down' | null;
  upvotes?: number;
  downvotes?: number;
  ageRating?: 'L' | '10' | '12' | '14' | '16' | '18';
}

export interface Chapter {
  id: number;
  title: string;
  date: string;
  images: string[];
  isRead?: boolean;
}

export interface AudioScene {
  id: string;
  imageUrl: string;
  audioUrl: string;
  duration: number; // in seconds
  caption?: string;
}

export interface AudioStory {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  duration: string;
  trending?: boolean;
  scenes: AudioScene[];
  voiceActors?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  plan: 'Free' | 'Leitor em Ascensão' | 'Premium' | 'Family';
  role?: 'reader' | 'author';
  isChild?: boolean;
}



export const MOCK_PROFILES: UserProfile[] = [
  {
    id: "user-1",
    name: "Story Traveler",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuApStl9tdK_wC18iCD0VqAv-csT90TSnRAjfDLLg23TBSPrHwRqd_lmffakUW1OW3OQ07k7XHrvIyXsJgbayg804S9nT0g9ANBbxHBDQtX0BoXSHvX4oCA_Dd7jv2qh47lfao8KsxIuXUE7E6Qb_r5OdPHWXIJ4NVf1_iHr765PV0nwEfF4w3wUw4sSlgnl_S-bYgm2ixMMZl3a6pO6G26HkpOypAJ7FAMOtRg6AX6189rG3Kevh_ljdu3sc_6BCIckBNW0m2D7fuI",
    plan: "Premium"
  },
  {
    id: "user-2",
    name: "Aventureiro Kid",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDocpZnnLhxIqRckq9W1lvRrH1u8rc_QPznJTe1wkh_7OQbnjxQ1FiTyDsskRH8jrd6Svnhz6rBwQKnt6PPr1PLhzKO0o9cKBZ1pDX0mrgXPxqliNr_ChiY4mfjpWVazcHB7YRcEHsviRatXi9q-YSLO6-47IzwwPA43Vnu4Ur8S-h1JRDngcqataYQ1ZNg4EAbOkO-FSt9G1XPehsVSTiCQS14dZoKuEAYzqYbUjCbwfs5WDSUKya1QzPs0AjNTnMtLMD6HbFsHk",
    plan: "Premium",
    isChild: true
  },
  {
    id: "user-3",
    name: "Convidado",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6jEbyM1bJBpNfjrYIITvVTIYg10gYYd323ElkIb2xye4-6387gg7AF6eCJ9oinqMt2Ic1XEGOEYxx__yiVNlafax-h15ZWfxgvY9QTQINpjfkthLLkd0kLtVaePgZb5kIkIujikgPn-pGYsePcDRmLCvrUyHcsHpRgqS-PWoSEcaGicUcM3KaoGSj6qfL3uvxC5nVc9T_06-sY9jBTckHgHHHJWRn-VANW-nmHDs0ljKJ3i13l5mg7pX-1zX7hkyuuiAMnMOSviM",
    plan: "Free"
  }
];

export const MOCK_AUDIO_STORYS: AudioStory[] = [
  {
    id: "shadow-whispers",
    title: "Sussurros da Sombra",
    author: "Elena Vance",
    duration: "14h 20min",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDocpZnnLhxIqRckq9W1lvRrH1u8rc_QPznJTe1wkh_7OQbnjxQ1FiTyDsskRH8jrd6Svnhz6rBwQKnt6PPr1PLhzKO0o9cKBZ1pDX0mrgXPxqliNr_ChiY4mfjpWVazcHB7YRcEHsviRatXi9q-YSLO6-47IzwwPA43Vnu4Ur8S-h1JRDngcqataYQ1ZNg4EAbOkO-FSt9G1XPehsVSTiCQS14dZoKuEAYzqYbUjCbwfs5WDSUKya1QzPs0AjNTnMtLMD6HbFsHk",
    trending: true,
    scenes: [
      { id: "s1", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDocpZnnLhxIqRckq9W1lvRrH1u8rc_QPznJTe1wkh_7OQbnjxQ1FiTyDsskRH8jrd6Svnhz6rBwQKnt6PPr1PLhzKO0o9cKBZ1pDX0mrgXPxqliNr_ChiY4mfjpWVazcHB7YRcEHsviRatXi9q-YSLO6-47IzwwPA43Vnu4Ur8S-h1JRDngcqataYQ1ZNg4EAbOkO-FSt9G1XPehsVSTiCQS14dZoKuEAYzqYbUjCbwfs5WDSUKya1QzPs0AjNTnMtLMD6HbFsHk", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: 10, caption: "Uma sombra escura rasteja pelas paredes da antiga mansão." },
      { id: "s2", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfz-1EfxCSyG1I4--4jJlR4hUi-SXxYYZmkiu3BPAQX4yfy1nZJB1cWgjWwUolXxg1vTfpNhXY0toiQrnOwMGsnO9jOH--ada9mWLXczUpP8UmrDiojrchcGlCPdf6xqIbLBhAqR8zEgAwc-zjkKKDbRxR3oHSKu5sDqhUCO2N6dTBJMXytYTr64wh3LbF4vo45FsD2IWitS8qzAAjxy8yu2MwkznzdE3bqVXwP0dLxwELXj-RdUHcoGH1Fh_z51OslTBP1lC8NnE", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: 15, caption: "Os sussurros tornam-se gritos na calada da noite." }
    ],
    voiceActors: ["Guilherme Briggs", "Wendel Bezerra", "Tati Keplmair"]
  },
  {
    id: "neon-pulse",
    title: "Pulso de Neon",
    author: "Marcus Kaine",
    duration: "8h 45min",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfz-1EfxCSyG1I4--4jJlR4hUi-SXxYYZmkiu3BPAQX4yfy1nZJB1cWgjWwUolXxg1vTfpNhXY0toiQrnOwMGsnO9jOH--ada9mWLXczUpP8UmrDiojrchcGlCPdf6xqIbLBhAqR8zEgAwc-zjkKKDbRxR3oHSKu5sDqhUCO2N6dTBJMXytYTr64wh3LbF4vo45FsD2IWitS8qzAAjxy8yu2MwkznzdE3bqVXwP0dLxwELXj-RdUHcoGH1Fh_z51OslTBP1lC8NnE",
    trending: true,
    scenes: [
      { id: "n1", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfz-1EfxCSyG1I4--4jJlR4hUi-SXxYYZmkiu3BPAQX4yfy1nZJB1cWgjWwUolXxg1vTfpNhXY0toiQrnOwMGsnO9jOH--ada9mWLXczUpP8UmrDiojrchcGlCPdf6xqIbLBhAqR8zEgAwc-zjkKKDbRxR3oHSKu5sDqhUCO2N6dTBJMXytYTr64wh3LbF4vo45FsD2IWitS8qzAAjxy8yu2MwkznzdE3bqVXwP0dLxwELXj-RdUHcoGH1Fh_z51OslTBP1lC8NnE", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", duration: 12, caption: "O asfalto brilha sob as luzes de neon da metrópole cibernética." }
    ],
    voiceActors: ["Charles Emmanuel", "Ursula Bezerra"]
  },
  {
    id: "lost-echoes",
    title: "Ecos Perdidos",
    author: "Sarah J. Maas",
    duration: "12h 10min",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVxCNgy6bLJtcAItZ0_fxXZ9R_mQaxRfiFvKqpkRKw2vJgLArmA3Hx0jJ31I3Jv6A2nkjz5KaEnAq0xdnNr6LaoSf9KRk3s0Tjb1lxpfrLpcfn7lHLXPset4s4cwQ8suiCh71Ff2GJAS_JNpkFEOcCPCYKh3J3hiYtrfQkJQJ3-OPl9iSN8tyf9ehHdO_V4KAmUKwLuN04BqR8WEdNLN77CQfE5Wtxdxt75kS-LpVuaRYOH5kJxu_V8sRF5ZM5co8z4WMbEk6Gzwg",
    trending: true,
    scenes: [
      { id: "e1", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVxCNgy6bLJtcAItZ0_fxXZ9R_mQaxRfiFvKqpkRKw2vJgLArmA3Hx0jJ31I3Jv6A2nkjz5KaEnAq0xdnNr6LaoSf9KRk3s0Tjb1lxpfrLpcfn7lHLXPset4s4cwQ8suiCh71Ff2GJAS_JNpkFEOcCPCYKh3J3hiYtrfQkJQJ3-OPl9iSN8tyf9ehHdO_V4KAmUKwLuN04BqR8WEdNLN77CQfE5Wtxdxt75kS-LpVuaRYOH5kJxu_V8sRF5ZM5co8z4WMbEk6Gzwg", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", duration: 20, caption: "Ela ouviu o eco de sua própria voz, mas respondeu alguém que não estava lá." }
    ],
    voiceActors: ["Mabel Cezar", "Ricardo Juarez"]
  }
];

export const MOCK_COMICS: Comic[] = [
  {
    id: "neon-ascendant",
    title: "Neon Ascendant",
    description: "In a world where memories are currency, a rogue archivist discovers a digital vault that could collapse the entire system. Her ascent begins now.",
    author: "Tori Original",
    rating: 4.8,
    ratingCount: "8k",
    status: "Ongoing",
    category: "Sci-Fi",
    ageRating: "16",
    tags: ["Action", "Sci-Fi", "Cyberpunk"],
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfz-1EfxCSyG1I4--4jJlR4hUi-SXxYYZmkiu3BPAQX4yfy1nZJB1cWgjWwUolXxg1vTfpNhXY0toiQrnOwMGsnO9jOH--ada9mWLXczUpP8UmrDiojrchcGlCPdf6xqIbLBhAqR8zEgAwc-zjkKKDbRxR3oHSKu5sDqhUCO2N6dTBJMXytYTr64wh3LbF4vo45FsD2IWitS8qzAAjxy8yu2MwkznzdE3bqVXwP0dLxwELXj-RdUHcoGH1Fh_z51OslTBP1lC8NnE",
    bannerUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7DoT9RJGezyrqkm3B5zf6Mjjsqq-A1VFsOuuSZvSmjmHmIKhg_83cmhMg6j_IWuhM7wEPo61UUl5ImOysvPMchi5bRNuvIi_r3W7nHhH37gT_BVRo-hS1w6vXBiuJ-2tvpKDm-hPVo1XbQpVUR9uIBD7HhHtKtt0OC-di63Pw-OYbpsSznctLaroHKeEqTpoovROL9Zx07013nHzVJs2ka_BaGVkwnEjFZTD64EtPhG9GsjobnnpkoJeYWACZFNi0iapeCARDK9M",
    progress: 45,
    chapters: [
      { 
        id: 42, 
        title: "The Ascent", 
        date: "Today", 
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAQO9JWlipyP6yTfYLkCp_9Td8OUHPuWPhnOFgz6inwIVkAgP4mGBRtcKMXeoBGTSOdGGNe1RORc9NnvFgPBy2H0XMQCPOzTnzB6NfrgzBXsOnujVwo7uLRH2jbIKgNMTjOnCngL627dWBJY6ngsc9fhIaeONN_vAXtrZoivd0ks4iA4MSgYfR77UkROTkaWVlNoBA_LwEMqo9JTpOnmiW-bdj6yXvfK9dDwcGhEqRNEjTkBp8HtIjmQGmaGS9FLhheypDNSBbHR9A",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuARF6_3nf5qKxmvnSMPGA-rFGL637UpcVDqbuH9XmnhCnm2eXlPGVApPuS1MpAmJIBWuC6sB9vw5ccewsv1EZktHBIO5Veq9LuZffNhMghhd1-brwuxp5cX6LlAVYhbZFws3TkfJCFKRmd8THGjmAP4Tb2o6ZVgIYj7f8OexOXnZhVU2CiQwGCDGWx2e7iaK67ctbiTglBjw0tkBXB2sGKR7krcms2n8JSw6QCtvBtFLvN2oOmlIDKjuUklznlPqR18r_0jDjmUHGI",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDocpZnnLhxIqRckq9W1lvRrH1u8rc_QPznJTe1wkh_7OQbnjxQ1FiTyDsskRH8jrd6Svnhz6rBwQKqnt6PPr1PLhzKO0o9cKBZ1pDX0mrgXPxqliNr_ChiY4mfjpWVazcHB7YRcEHsviRatXi9q-YSLO6-47IzwwPA43Vnu4Ur8S-h1JRDngcqataYQ1ZNg4EAbOkO-FSt9G1XPehsVSTiCQS14dZoKuEAYzqYbUjCbwfs5WDSUKya1QzPs0AjNTnMtLMD6HbFsHk",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuC6jEbyM1bJBpNfjrYIITvVTIYg10gYYd323ElkIb2xye4-6387gg7AF6eCJ9oinqMt2Ic1XEGOEYxx__yiVNlafax-h15ZWfxgvY9QTQINpjfkthLLkd0kLtVaePgZb5kIkIujikgPn-pGYsePcDRmLCvrUyHcsHpRgqS-PWoSEcaGicUcM3KaoGSj6qfL3uvxC5nVc9T_06-sY9jBTckHgHHHJWRn-VANW-nmHDs0ljKJ3i13l5mg7pX-1zX7hkyuuiAMnMOSviM"
        ] 
      }
    ]
  },
  {
    id: "shadow-weaver",
    title: "Shadow Weaver",
    description: "In a world where light is a rare commodity controlled by the elite, an underground society of 'Weavers' harness the power of shadows to survive.",
    author: "Tori Original",
    rating: 4.9,
    ratingCount: "12k",
    status: "Ongoing",
    category: "Fantasy",
    ageRating: "12",
    tags: ["Action", "Fantasy", "Mystery"],
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVxCNgy6bLJtcAItZ0_fxXZ9R_mQaxRfiFvKqpkRKw2vJgLArmA3Hx0jJ31I3Jv6A2nkjz5KaEnAq0xdnNr6LaoSf9KRk3s0Tjb1lxpfrLpcfn7lHLXPset4s4cwQ8suiCh71Ff2GJAS_JNpkFEOcCPCYKh3J3hiYtrfQkJQJ3-OPl9iSN8tyf9ehHdO_V4KAmUKwLuN04BqR8WEdNLN77CQfE5Wtxdxt75kS-LpVuaRYOH5kJxu_V8sRF5ZM5co8z4WMbEk6Gzwg",
    bannerUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbAZHLUHPvPuqeOsOdxR3mciBm8C25F9RQhZtAJzakIwoe51_K0bGFSCX21m3SJiSwtq8hTEBfkbB8dVcJWSgI029ojNOa-O53-iDJgc5KfdX31GLISxtRGcGLgNlQ_yZPdLWarXmh82oOo6CyekfKuCfwGeFPbCgV7Wd7Y_DdGGXPLjiRVQnt-7mvkP1PVP81CKS75oeCIG8evlsNpdk4xzGBFt1yAH2CAAP_eLmbzfBj4qy2TVKXJx9d5acOtUuW6zNOSoK6R5Y",
    progress: 85,
    chapters: [
      { id: 1, title: "The Descent", date: "Oct 12, 2023", images: [] },
      { id: 2, title: "Echoes in the Dark", date: "Oct 19, 2023", images: [] },
      { id: 3, title: "Spark of Defiance", date: "Oct 26, 2023", images: [] }
    ]
  }
];
