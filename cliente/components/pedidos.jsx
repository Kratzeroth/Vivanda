import { useState } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import "../src/assets/CSS/orders.css";

export const OrdersPage = () => {
    const [activeTab, setActiveTab] = useState("todos");

    // Pedidos de ejemplo
    const pedidos = [
        { id: 1, estado: "pendiente", producto: "Arroz Costeño 5kg", precio: "S/ 25.90" },
        { id: 2, estado: "enviado", producto: "Leche Gloria 1L", precio: "S/ 4.50" },
        { id: 3, estado: "finalizado", producto: "Café Altomayo 500g", precio: "S/ 18.90" },
        { id: 4, estado: "cancelado", producto: "Aceite Primor 1L", precio: "S/ 9.50" },
    ];

    const filterPedidos = (estado) => {
        if (estado === "todos") return pedidos;
        return pedidos.filter((p) => p.estado === estado);
    };

    return (
        <>
            <Header />

          
            <Footer />
        </>
    );
};
