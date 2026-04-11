import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <a href="https://wa.me/5403624526860" className="whatsapp-float" target="_blank" rel="noopener">
        <img src="/img/whatsapp.png" alt="WhatsApp" />
      </a>
      <Footer />
    </>
  )
}
