"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useSettings } from "../context/settingContext";
import { useEffect, useState } from "react";
import axiosPublic from "@/lib/axiosPublic";
import { useRouter, usePathname } from "next/navigation";
import { useLang } from "../context/langContext";
import Loader from "@/components/Loader";

type TLanguage = {
  _id: string;
  title: string;
  language_code: string;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings } = useSettings();
  const { setLang } = useLang();
  const [language, setLanguage] = useState<TLanguage[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const [showOptions, setShowOptions] = useState(true);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang === settings?.content && settings?.content !== "off") {
      setLang(savedLang as string);
    } else if (settings?.content && settings.content !== "off") {
      setLang(settings.content);
      localStorage.setItem("selectedLanguage", settings.content);
    } else if (settings?.content === "off") {
      localStorage.removeItem("selectedLanguage");
      setLang("all");
    }
  }, [settings?.content, setLang]);

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const response = await axiosPublic.get(`/language`);
        setLanguage(response.data.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
    fetchLanguage();
  }, []);

  useEffect(() => {
    if (settings?.content !== undefined) {
      setIsSettingsLoaded(true);
    }
  }, [settings?.content]);

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");

    if (isSettingsLoaded && savedLang && pathname === "/") {
      setLoading(true);
      setLang(savedLang);
      router.push(`/${savedLang}`);
      setLoading(false);
    }
  }, [isSettingsLoaded, pathname, setLang, router]);

  const handleCardClick = (languageCode: string) => {
    setShowOptions(false);
    setLang(languageCode);
    localStorage.setItem("selectedLanguage", languageCode);
    router.push(`/${languageCode}`);
  };

  if (loading || !isSettingsLoaded) {
    return <Loader />;
  }

  if (settings?.content === "off" && showOptions && pathname === "/") {
    return (
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {language?.map((lang) => (
            <div
              key={lang._id}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(lang.language_code)}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">🌐</div>{" "}
                <div className="text-lg font-bold text-gray-800 mb-1">
                  {lang.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main>
      <Header top={1} header={1} menu={1} />
      {children}
      <Footer />
    </main>
  );
}
