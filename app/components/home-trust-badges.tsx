import Image from "next/image";
import {
  HOME_GLASS_CONTAINER_CLASS,
  HOME_GLASS_SECTION_CLASS,
} from "./home-glass-shell";

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
          <div
            key={badge.title}
            className="flex w-[140px] flex-col items-center gap-2 rounded-[16px] p-4 text-center"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            <Image
              src={badge.icon}
              alt={badge.alt}
              width={48}
              height={48}
              className="object-contain"
            />
            <span className="text-xs font-bold text-white">{badge.title}</span>
            <span className="text-[11px] leading-snug text-white/55">
              {badge.subtitle}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
