import {
  HOME_GLASS_CONTAINER_CLASS,
  HOME_GLASS_SECTION_CLASS,
} from "./home-glass-shell";

const BADGE_STYLE = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "16px",
  padding: "16px 18px",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  gap: "8px",
  width: "140px",
  textAlign: "center" as const,
};

const BADGES = [
  {
    icon: "/trust-icons/quality.png",
    alt: "جودة مضمونة",
    title: "جودة مضمونة",
    subtitle: "معايير احترافية",
  },
  {
    icon: "/trust-icons/security.png",
    alt: "دفع آمن",
    title: "دفع آمن",
    subtitle: "محافظة على خصوصية البيانات",
  },
  {
    icon: "/trust-icons/delivery.png",
    alt: "تسليم فوري",
    title: "تسليم فوري",
    subtitle: "بعد الدفع مباشرة",
  },
  {
    icon: "/trust-icons/support.png",
    alt: "دعم 24/7",
    title: "دعم 24/7",
    subtitle: "فريق سعودي يساعدك",
  },
];

export default function HomeTrustBadges() {
  return (
    <section className={HOME_GLASS_SECTION_CLASS} dir="rtl">
      <div
        className={`${HOME_GLASS_CONTAINER_CLASS} flex flex-wrap justify-center gap-4`}
      >
        {BADGES.map((badge) => (
          <div key={badge.title} style={BADGE_STYLE}>
            <img
              src={badge.icon}
              alt={badge.alt}
              width={48}
              height={48}
              style={{ objectFit: "contain" }}
            />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>
              {badge.title}
            </span>
            <span
              style={{
                fontSize: "9px",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.4,
              }}
            >
              {badge.subtitle}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
