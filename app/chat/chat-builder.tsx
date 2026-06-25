"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { chatAnswersToFormData } from "@/lib/chat-to-cv-form";
import {
  CURRENT_CV_ID_KEY,
  STORAGE_KEY,
  saveCvToAccount,
} from "@/lib/cv-storage";
import type { GeneratedCv, Language } from "@/lib/cv-types";
import { prepareCvPayload } from "@/lib/prepare-cv-payload";
import { GLASS_INPUT_CLASS } from "@/app/components/home-glass-shell";
import { BRAND } from "@/lib/brand";
const TOTAL_QUESTIONS = 7;

const REMINDER =
  "كلما أعطيت تفاصيل أكثر كلما كانت سيرتك أقوى 💡";

type Question = {
  id: number;
  label: string;
  tip: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    label: "ما اسمك الكامل؟",
    tip: "مثال: محمد عبدالله العمري",
    placeholder: "اكتب اسمك الكامل",
    required: true,
  },
  {
    id: 2,
    label: "ما مسمّاك الوظيفي؟",
    tip: "مثال: مدير تسويق، مهندس برمجيات",
    placeholder: "مثال: مدير مشاريع",
    required: true,
  },
  {
    id: 3,
    label: "سولف عن خبراتك المهنية - المسمى، الشركة، التواريخ، وش سويت",
    tip: "مثال: شغلت مدير مشاريع في stc من 2020 لـ 2023، كنت أدير فريق من 5 أشخاص",
    placeholder: "اكتب خبراتك بالتفصيل...",
    multiline: true,
    required: true,
  },
  {
    id: 4,
    label: "شهادتك الجامعية؟ التخصص، الجامعة، السنة، والمعدل اختياري",
    tip: "مثال: بكالوريوس إدارة أعمال، جامعة الملك سعود، 2015-2019",
    placeholder: "اكتب تفاصيل شهادتك...",
    multiline: true,
    required: true,
  },
  {
    id: 5,
    label: "عندك دورات تبي تذكرها؟ أو اكتب لا",
    tip: "مثال: PMP، Google Analytics، Excel متقدم",
    placeholder: "اكتب الدورات أو «لا»",
  },
  {
    id: 6,
    label: "عندك مهارات تقنية؟",
    tip: "مثال: Excel، PowerPoint، SAP، Photoshop",
    placeholder: "اكتب مهاراتك مفصولة بفاصلة",
    required: true,
  },
  {
    id: 7,
    label: "عرّف نفسك بجملتين بالعامي",
    tip: "مثال: أنا شخص طموح أحب التحديات عندي خبرة في التسويق",
    placeholder: "اكتب وصفاً مختصراً عن نفسك...",
    multiline: true,
    required: true,
  },
];

type ChatBuilderProps = {
  userEmail: string;
};

type Screen = "welcome" | "question" | "generating";

export default function ChatBuilder({ userEmail }: ChatBuilderProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({
    name: "",
    jobTitle: "",
    experience: "",
    education: "",
    courses: "",
    skills: "",
    selfDescription: "",
    language: "" as Language,
  });
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const progress =
    screen === "question"
      ? ((questionIndex + 1) / TOTAL_QUESTIONS) * 100
      : 0;

  const startChat = () => {
    setScreen("question");
    setQuestionIndex(0);
    setInputValue("");
    setError(null);
  };

  const saveCurrentAnswer = (): boolean => {
    const question = QUESTIONS[questionIndex];
    const value = inputValue.trim();

    if (question.required && !value) {
      setError("يرجى الإجابة على السؤال للمتابعة.");
      return false;
    }

    const keyMap: Record<number, keyof typeof answers> = {
      0: "name",
      1: "jobTitle",
      2: "experience",
      3: "education",
      4: "courses",
      5: "skills",
      6: "selfDescription",
    };

    const key = keyMap[questionIndex];
    if (key) {
      setAnswers((prev) => ({ ...prev, [key]: value }));
    }

    setError(null);
    return true;
  };

  const goNext = () => {
    if (!saveCurrentAnswer()) return;

    if (questionIndex < QUESTIONS.length - 1) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      const nextKey = [
        "name",
        "jobTitle",
        "experience",
        "education",
        "courses",
        "skills",
        "selfDescription",
      ][nextIndex] as keyof typeof answers;
      setInputValue(String(answers[nextKey] ?? ""));
      return;
    }

    setQuestionIndex(QUESTIONS.length);
    setInputValue("");
  };

  const goBack = () => {
    setError(null);
    if (questionIndex === 0) {
      setScreen("welcome");
      return;
    }
    const prevIndex = questionIndex - 1;
    setQuestionIndex(prevIndex);
    const prevKey = [
      "name",
      "jobTitle",
      "experience",
      "education",
      "courses",
      "skills",
      "selfDescription",
    ][prevIndex] as keyof typeof answers;
    setInputValue(String(answers[prevKey] ?? ""));
  };

  const generateCv = async (language: Language) => {
    setError(null);
    setGenerating(true);
    setScreen("generating");

    const finalAnswers = { ...answers, language };

    const formData = prepareCvPayload(
      chatAnswersToFormData(finalAnswers, userEmail)
    );

    if (!formData.language) {
      setError("يرجى اختيار لغة السيرة الذاتية.");
      setGenerating(false);
      setScreen("question");
      setQuestionIndex(QUESTIONS.length);
      return;
    }

    if (!formData.name || !formData.email) {
      setError("البيانات الأساسية ناقصة.");
      setGenerating(false);
      setScreen("question");
      return;
    }

    if (!formData.selfDescription) {
      setError("يرجى كتابة الوصف الذاتي.");
      setGenerating(false);
      setScreen("question");
      setQuestionIndex(QUESTIONS.length - 1);
      return;
    }

    try {
      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();
      let result: Record<string, unknown>;

      try {
        result = JSON.parse(responseText) as Record<string, unknown>;
      } catch {
        setError("استجابة غير صالحة من الخادم.");
        setGenerating(false);
        setScreen("question");
        setQuestionIndex(QUESTIONS.length);
        return;
      }

      if (!response.ok) {
        setError(
          typeof result.error === "string"
            ? result.error
            : "حدث خطأ أثناء إنشاء السيرة الذاتية."
        );
        setGenerating(false);
        setScreen("question");
        setQuestionIndex(QUESTIONS.length);
        return;
      }

      const generatedCv = result as GeneratedCv;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(generatedCv));
      const saved = await saveCvToAccount(generatedCv, formData);
      const cvId = saved?.id;
      if (cvId) {
        sessionStorage.setItem(CURRENT_CV_ID_KEY, cvId);
        router.push(`/enhance?cv=${cvId}`);
      } else {
        router.push("/enhance");
      }
    } catch {
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
      setGenerating(false);
      setScreen("question");
      setQuestionIndex(QUESTIONS.length);
    }
  };

  const handleNextOnLastTextQuestion = () => {
    if (!saveCurrentAnswer()) return;
    setAnswers((prev) => ({ ...prev, language: "both" }));
    void generateCv("both");
  };

  if (screen === "generating" || generating) {
    return (
      <div className="glass-page-card animate-fade-in p-8 text-center sm:p-12">
        <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        <h2 className="mb-2 text-xl font-extrabold text-white sm:text-2xl">
          جاري بناء سيرتك الذاتية ✨
        </h2>
        <p className="text-sm text-white/70 sm:text-base">
          الذكاء الاصطناعي يصيغ سيرة احترافية من إجاباتك
        </p>
      </div>
    );
  }

  if (screen === "welcome") {
    return (
      <div className="glass-page-card animate-fade-in p-6 sm:p-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl">
          👋
        </div>
        <h1 className="mb-4 text-2xl font-extrabold leading-snug text-white sm:text-3xl">
          أهلاً!
        </h1>
        <p className="mb-8 text-base leading-8 text-white/75 sm:text-lg">
          أنا هنا أبني لك سيرة ذاتية احترافية في دقائق. نصيحة مهمة: كلما كانت
          إجاباتك أكثر تفصيلاً وتحتوي على أرقام وإنجازات، كلما كانت سيرتك أقوى.
          مثلاً بدل &quot;أدرت فريق&quot; قل &quot;أدرت فريق من 8 أشخاص وحققنا
          زيادة 35% في المبيعات&quot;
        </p>
        <button
          type="button"
          onClick={startChat}
          className="glass-btn-primary w-full px-6 py-4 text-base transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
        >
          نبدأ 🚀
        </button>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[questionIndex];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-[#FAC775]">
            السؤال {questionIndex + 1} من {TOTAL_QUESTIONS}
          </span>
          <span className="text-white/60">محادثة بناء السيرة</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, backgroundColor: BRAND }}
          />
        </div>
      </div>

      <div className="glass-page-card p-6 sm:p-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-300/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {currentQuestion && (
          <div>
            <h2 className="mb-4 text-xl font-extrabold leading-snug text-white sm:text-2xl">
              {currentQuestion.label}
            </h2>

            {currentQuestion.multiline ? (
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentQuestion.placeholder}
                rows={5}
                className={GLASS_INPUT_CLASS + " resize-y"}
              />
            ) : (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className={GLASS_INPUT_CLASS}
              />
            )}

            <p className="mt-3 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/75">
              <span className="font-semibold text-[#FAC775]">💡 </span>
              {currentQuestion.tip}
            </p>

            <p className="mt-3 text-center text-xs font-medium text-white/55 sm:text-sm">
              {REMINDER}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            className="glass-btn-secondary rounded-xl px-5 py-3 text-sm"
          >
            رجوع
          </button>
          <button
            type="button"
            onClick={
              questionIndex === QUESTIONS.length - 1
                ? handleNextOnLastTextQuestion
                : goNext
            }
            className="glass-btn-primary rounded-xl px-6 py-3 text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {questionIndex === QUESTIONS.length - 1 ? "إنشاء السيرة ✨" : "التالي ←"}
          </button>
        </div>
      </div>
    </div>
  );
}
