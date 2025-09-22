// src/pages/Offers.jsx
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import "../src/assets/CSS/offers.css";

const offers = [
  // Tecnología
  { id: 1, category: "Tecnología", title: "Laptop Gamer ASUS ROG", description: "Potente laptop gamer con RTX 4070, 16GB RAM y SSD 1TB.", price: "S/ 5,621", discount: "20% OFF", image: "https://m.media-amazon.com/images/I/71sgAr9atBS._AC_SL1500_.jpg" },
  { id: 2, category: "Tecnología", title: "iPhone 15 Pro Max", description: "El smartphone más avanzado de Apple con cámara Pro.", price: "S/ 4,121", discount: "15% OFF", image: "https://media.revistagq.com/photos/64648c1f4c1636d5edee1a32/16:9/w_2560%2Cc_limit/iPhone15pro.jpeg" },
  { id: 3, category: "Tecnología", title: "Consola PlayStation 5", description: "La última consola de Sony con gráficos de nueva generación.", price: "S/ 2,246", discount: "10% OFF", image: "https://hiraoka.com.pe/media/mageplaza/blog/post/p/s/ps5-pro-precio-caracteristicas-fecha-de-lanzamiento-playstation5-pro.jpg" },
  { id: 4, category: "Hogar", title: "Smart TV Samsung 65'' 4K", description: "Televisor UHD con HDR y apps de streaming integradas.", price: "S/ 2,996", discount: "30% OFF", image: "https://http2.mlstatic.com/D_NQ_NP_884486-MLU77841128483_072024-O.webp" },
  { id: 5, category: "Hogar", title: "Silla Gamer Ergonomica", description: "Diseño cómodo para largas horas de juego y trabajo.", price: "S/ 709", discount: "40% OFF", image: "https://media.falabella.com/falabellaPE/115780204_01/w=1500,h=1500,fit=pad" },
  { id: 6, category: "Electrónica", title: "Auriculares Sony WH-1000XM5", description: "Cancelación de ruido premium y hasta 30h de batería.", price: "S/ 1,121", discount: "25% OFF", image: "https://www.sony.com.pe/image/4e4154f981a0c362a20d5a3eaea6605e?fmt=pjpeg&wid=1014&hei=396&bgcolor=F1F5F9&bgc=F1F5F9" },
  { id: 7, category: "Moda", title: "Zapatillas Deportivas Nike", description: "Cómodas y resistentes, ideales para entrenar y diario.", price: "S/ 450", discount: "35% OFF", image: "https://www.nike.com.pe/on/demandware.static/-/Sites-catalog-equinox/default/dw739e07df/images/hi-res/196975441105_1_20240403-mrtPeru.jpg" },
  { id: 8, category: "Moda", title: "Chaqueta Impermeable Columbia", description: "Perfecta para lluvia y actividades al aire libre.", price: "S/ 371", discount: "25% OFF", image: "https://columbiape.vtexassets.com/arquivos/ids/314409-800-auto?v=638561578141130000&width=800&height=auto&aspect=true" },
  { id: 9, category: "Deportes", title: "Bicicleta MTB 29''", description: "Resistente y ligera, ideal para montaña y ciudad.", price: "S/ 2,438", discount: "15% OFF", image: "https://static.wixstatic.com/media/21c93c_4cbb96f7413e462fb8e69ded3a5f3436~mv2.jpg/v1/fill/w_560,h_560,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c93c_4cbb96f7413e462fb8e69ded3a5f3436~mv2.jpg" },
  { id: 10, category: "Deportes", title: "Balón de fútbol Adidas", description: "Balón profesional, aprobado por ligas oficiales.", price: "S/ 184", discount: "20% OFF", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdCWgg0Jeqxy12t-DAeOVfPd4sI15cj0lMqA&s" },
  { id: 11, category: "Electrodomésticos", title: "Aspiradora Robot Xiaomi", description: "Limpieza automática y control por app.", price: "S/ 933", discount: "30% OFF", image: "https://i02.appmifile.com/636_operator_sg/07/03/2023/6e1b93f369c1abf3b3ef1565a3bdc3a6.png" },
  { id: 12, category: "Belleza", title: "Secador Dyson Supersonic", description: "Tecnología profesional para cabello saludable.", price: "S/ 1,497", discount: "20% OFF", image: "https://hips.hearstapps.com/hmg-prod/images/secador-dyson-supersonic-pelo-6479b2ee2b0d5.jpg" },
  { id: 13, category: "Niños", title: "Set LEGO Star Wars", description: "Construye tu propia nave espacial.", price: "S/ 334", discount: "25% OFF", image: "https://assets.nintendo.com/image/upload/q_auto/f_auto/ncom/software/switch/70010000018041/e52844f237f452c187db5daec14c3300f45d7be100c1dcff88c7188c8b9b48a9" },
  { id: 14, category: "Jardín", title: "Cortacésped Eléctrico", description: "Mantén tu jardín impecable sin esfuerzo.", price: "S/ 746", discount: "30% OFF", image: "https://www.makpoint.es/thumb.php?i=./archivos/blog/_cortacesped-bateria_1691479624.jpg&w=800&h=16:9&crop" },
  { id: 15, category: "Automotriz", title: "Cámara de tablero Dash Cam", description: "Graba cada viaje con alta definición.", price: "S/ 296", discount: "15% OFF", image: "https://szbanuo.com/wp-content/uploads/2024/07/Universal-Dash-cam-Single-Len-2.jpg" },
  { id: 16, category: "Oficina", title: "Silla Ergonómica Oficina", description: "Comodidad y soporte para largas jornadas.", price: "S/ 559", discount: "20% OFF", image: "https://somabarcelona.com/wp-content/uploads/2024/04/silla-ergonomica-salud-postural.jpg" },
  { id: 17, category: "Tecnología", title: "Tablet Samsung Galaxy Tab S8", description: "Potente tablet para productividad y entretenimiento.", price: "S/ 1,871", discount: "15% OFF", image: "https://home.ripley.com.pe/Attachment/WOP_5/2004297829564/2004297829564_2.jpg" },
  { id: 18, category: "Hogar", title: "Microondas Panasonic", description: "Calienta y cocina con funciones avanzadas.", price: "S/ 484", discount: "25% OFF", image: "https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/5232/PMP20000865554/full_image-1.webp" },
  { id: 19, category: "Moda", title: "Reloj Smartwatch Garmin", description: "Controla tu actividad física y notificaciones.", price: "S/ 746", discount: "20% OFF", image: "https://promart.vteximg.com.br/arquivos/ids/8218823-700-700/image-252ffc38c92a469faa1cf10c6b398b15.jpg?v=638641111639700000" },
  { id: 20, category: "Deportes", title: "Patineta Eléctrica", description: "Diversión y movilidad urbana con batería duradera.", price: "S/ 1,309", discount: "15% OFF", image: "https://itmbikes.com/wp-content/uploads/2024/02/patinenta-electrica-tg2-1.jpg" },
];

const categories = ["Tecnología", "Hogar", "Electrónica", "Moda", "Deportes", "Electrodomésticos", "Belleza", "Niños", "Jardín", "Automotriz", "Oficina"];

export const OffersPage = () => (
  <>
    <Header />
    <section className="offers-hero">
      <h1>🔥 Ofertas Exclusivas 🔥</h1>
      <p>Aprovecha los mejores descuentos en tecnología, hogar, moda, deportes y más.</p>
    </section>

    {categories.map((cat) => (
      <section className="offers-section" key={cat}>
        <h2>{cat}</h2>
        <div className="offers-grid">
          {offers.filter((item) => item.category === cat).map((item) => (
            <div className="offer-card" key={item.id}>
              <div className="img-container">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="offer-info">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="discount">{item.discount}</span>
                <span className="price">{item.price}</span>
                <button>Agregar al carrito</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    ))}

    <section className="extra-offers">
      <h2>Promociones Especiales</h2>
      <div className="limited-offers">
        <div className="limited-card">
          <h3>2x1 en accesorios gamer</h3>
          <p>Teclados, ratones y más con descuentos únicos.</p>
        </div>
        <div className="limited-card">
          <h3>Hasta 50% en moda</h3>
          <p>Ropa y calzado con diseños exclusivos.</p>
        </div>
        <div className="limited-card">
          <h3>Semana de smartphones</h3>
          <p>Encuentra el tuyo con grandes rebajas.</p>
        </div>
      </div>
    </section>

    <Footer />
  </>
);
