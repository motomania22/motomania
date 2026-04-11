import Image from 'next/image'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <p>© Derechos reservados MOTOMANIA {year}</p>
      <div className="links-footer">
        <ul>
          <li>
            <a href="https://wa.me/5403624526860" target="_blank" rel="noopener">
              <Image src="/img/whatsapp.png" alt="WhatsApp" width={22} height={22} />
              +54 3624-526860
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/p/Motomania-100054418451961/?locale=es_LA" target="_blank" rel="noopener">
              <Image src="/img/facebook.png" alt="Facebook" width={20} height={20} />
              Motomania
            </a>
          </li>
          <li>
            <a href="https://www.google.com/maps/place/Motomania/@-26.9295223,-59.5182205,15z" target="_blank" rel="noopener">
              <Image src="/img/location.png" alt="Ubicación" width={18} height={18} />
              Roberto Mora 485, Colonia Elisa
            </a>
          </li>
        </ul>
      </div>
      <p style={{ fontSize: '.8rem', marginTop: '10px' }}>
        Pensado y desarrollado por Fabricio Barreto Desarrollos Web
      </p>
    </footer>
  )
}
