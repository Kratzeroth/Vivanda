import React from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import "../src/assets/CSS/aboutUs.css";

export const AboutUs = () => {
  return (
    <>
      <Header />

      {/* Hero profesional */}
      <section className="about-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Vivanda</h1>
            <p>
              Brindamos a nuestros clientes una experiencia de compra diferenciada
              en el sector retail, combinando productos de alta calidad con soluciones
              tecnológicas innovadoras que faciliten la selección, compra y descubrimiento
              de nuevos productos, respaldados por un servicio personalizado.
            </p>
            <a href="#about-cards" className="hero-btn">Conoce más</a>
          </div>
          <div className="hero-image">
            <img src="/images/vivanda.png" alt="Ilustración Vivanda" />
          </div>
        </div>
      </section>

      {/* Quiénes somos */}
      <section className="about-section">
        <div className="about-text">
          <h2>Quiénes somos</h2>
          <p>
            Vivanda es un supermercado premium en Perú que integra canales físicos y digitales,
            ofreciendo experiencias inteligentes basadas en IA que anticipan las necesidades
            de los clientes y optimizan la gestión interna. Nos enfocamos en frescura, atención
            personalizada y un surtido de productos de consumo masivo, frescos, gourmet y exclusivos.
          </p>
        </div>
      </section>

      {/* Misión, visión y valores */}
      <section className="about-cards" id="about-cards">
        <div className="card">
          <h3>Misión</h3>
          <p>
            Brindar a nuestros clientes una experiencia de compra diferenciada en el sector retail,
            combinando productos de alta calidad con soluciones tecnológicas innovadoras que faciliten
            la selección, compra y descubrimiento de nuevos productos, respaldados por un servicio personalizado.
          </p>
        </div>
        <div className="card">
          <h3>Visión</h3>
          <p>
            Convertirse en el referente de supermercados premium en Perú, integrando canales físicos y digitales
            con experiencias inteligentes basadas en IA, que anticipen las necesidades de los clientes
            y optimicen la gestión interna.
          </p>
        </div>
        <div className="card">
          <h3>Rubro de negocio</h3>
          <p>
            Sector: Retail – Supermercados y alimentos.<br/>
            Segmento: Venta de productos de consumo masivo, frescos, gourmet y exclusivos.<br/>
            Canales: E-commerce.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
};
