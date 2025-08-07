"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle, Zap, Shield, CreditCard, Globe, Smartphone, BarChart } from "lucide-react"

const faqs = [
  {
    question: "QART NFC kartı nasıl çalışır?",
    answer: "QART NFC kartınızı herhangi bir akıllı telefona yaklaştırdığınızda, kartınızdaki NFC çipi otomatik olarak telefonla iletişim kurar ve dijital profilinizi açar. Hiçbir uygulama indirmeye gerek yoktur! NFC özelliği olmayan telefonlar için kartınızdaki QR kodu kullanabilirsiniz.",
    icon: Smartphone,
    color: "from-blue-500 to-cyan-500"
  },
  {
    question: "Hangi telefonlarla uyumlu?",
    answer: "QART NFC kartı, NFC özelliği olan tüm Android ve iPhone (iPhone 7 ve üzeri) modelleriyle uyumludur. NFC özelliği olmayan cihazlar için entegre QR kod bulunmaktadır. Bu sayede %100 uyumluluk garantisi sunuyoruz.",
    icon: Globe,
    color: "from-purple-500 to-pink-500"
  },
  {
    question: "Bilgilerimi nasıl güncelleyebilirim?",
    answer: "Dashboard panelinizden kişisel bilgilerinizi ve sosyal medya hesaplarınızı anında güncelleyebilirsiniz. Telefon, adres veya sosyal medya hesaplarınız değiştiğinde, sadece birkaç tıkla güncelleme yapabilirsiniz. Değişiklikler anında yayına alınır.",
    icon: Zap,
    color: "from-orange-500 to-red-500"
  },
  {
    question: "Kart ne kadar dayanıklı?",
    answer: "QART NFC kartları premium PVC malzemeden üretilir. Su geçirmez, çizilmeye dayanıklı ve bükülebilir yapıdadır. Normal kullanımda 5-10 yıl sorunsuz çalışır. Ayrıca 2 yıl garanti veriyoruz!",
    icon: Shield,
    color: "from-green-500 to-emerald-500"
  },
  {
    question: "Hangi verileri takip edebilirim?",
    answer: "Detaylı analitik panelimizle; profil görüntülenme sayısı, ziyaretçi konumları, hangi sosyal medya linklerine tıklandığı, görüntülenme saatleri ve cihaz bilgileri gibi birçok veriyi takip edebilirsiniz.",
    icon: BarChart,
    color: "from-indigo-500 to-blue-500"
  },
  {
    question: "Ödeme nasıl yapılıyor?",
    answer: "Güvenli ödeme altyapımızla kredi kartı veya banka kartıyla ödeme yapabilirsiniz. 799₺ tek seferlik ödeme ile ömür boyu kullanım hakkına sahip olursunuz. Ek ücret veya aylık abonelik yoktur.",
    icon: CreditCard,
    color: "from-yellow-500 to-orange-500"
  }
]

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            QART NFC kartları hakkında merak ettiğiniz her şey
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <motion.div
                className={`
                  relative overflow-hidden rounded-2xl
                  bg-gradient-to-br from-gray-800/50 to-gray-900/50
                  backdrop-blur-sm border border-gray-700/50
                  transition-all duration-300
                  ${activeIndex === index ? 'border-white/30' : 'hover:border-gray-600'}
                `}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={`
                        w-12 h-12 rounded-xl flex items-center justify-center
                        bg-gradient-to-br ${faq.color}
                      `}
                      animate={activeIndex === index ? {
                        rotate: [0, 10, -10, 0],
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: activeIndex === index ? Infinity : 0,
                      }}
                    >
                      <faq.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <h3 className="text-lg md:text-xl font-semibold text-white">
                      {faq.question}
                    </h3>
                  </div>

                  <motion.div
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <motion.div
                          className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-4"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                        
                        <motion.p
                          className="text-gray-300 leading-relaxed"
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {faq.answer}
                        </motion.p>

                        {/* Animated background gradient */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${faq.color} opacity-5`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.05 }}
                          exit={{ opacity: 0 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hover effect line */}
                <motion.div
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${faq.color}`}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-gray-400 mb-4">
            Başka sorularınız mı var?
          </p>
          <motion.a
            href="mailto:destek@qart.app"
            className="inline-flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-medium">Bize ulaşın</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}