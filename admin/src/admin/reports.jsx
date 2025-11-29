import { useState, useEffect, useRef } from "react";
import Sidebar from "../componentes/sidebar.jsx";
import { Bar } from "react-chartjs-2";
import "../assets/css/reports.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

export default function Reports() {
  const [orders, setOrders] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const salesChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const inventoryChartRef = useRef(null);
  const chartDisplayColor = "#e2e8f0";
  const chartExportColor = "#111827";

  // CARGA INICIAL
  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch("http://localhost/Vivanda/admin/backend/orders.php").then(r => r.json()),
      fetch("http://localhost/Vivanda/admin/backend/pedido_detalle.php").then(r => r.json()),
      fetch("http://localhost/Vivanda/admin/backend/inventory.php").then(r => r.json())
    ])
      .then(([ordersData, detallesData, inventoryData]) => {
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setDetalles(Array.isArray(detallesData) ? detallesData : []);
        setInventory(Array.isArray(inventoryData) ? inventoryData : []);
      })
      .finally(() => setLoading(false));
  }, []);

  // GENERAR TRANSACCIONES
  useEffect(() => {
    const trans = orders.flatMap(o => {
      const detallesPedido = detalles.filter(d => d.id_pedido === o.id);
      if (!detallesPedido.length) {
        return [{ id: o.id, date: o.date, category: "Sin categoría", amount: o.total }];
      }
      return detallesPedido.map(d => ({
        id: o.id,
        date: o.date,
        category: d.nombre_categoria || "Sin categoría",
        amount: d.precio_unitario * d.cantidad
      }));
    });
    setTransactions(trans);
  }, [orders, detalles]);

  // ✔ DATASET 1: Ingresos Totales
  const salesData = {
    labels: transactions.map(t => t.date),
    datasets: [
      {
        label: "Ingresos",
        data: transactions.map(t => t.amount),
        backgroundColor: "#2ecc71"
      }
    ]
  };

  // ✔ DATASET 2: Ingresos por Categoría
  const categories = [...new Set(transactions.map(t => t.category))];
  const categoryData = {
    labels: categories,
    datasets: [
      {
        label: "Ingresos por Categoría",
        data: categories.map(cat =>
          transactions
            .filter(t => t.category === cat)
            .reduce((sum, t) => sum + t.amount, 0)
        ),
        backgroundColor: [
          "#3498db",
          "#2ecc71",
          "#f1c40f",
          "#e74c3c",
          "#9b59b6",
          "#1abc9c",
          "#e67e22",
          "#2c3e50"
        ]
      }
    ]
  };

  // ✔ DATASET 3: INVENTARIO (productos por categoría)
  const inventoryCategories = [...new Set(inventory.map(i => i.nombre_categoria || "Sin categoría"))];

  const inventoryData = {
    labels: inventoryCategories,
    datasets: [
      {
        label: "Productos por Categoría",
        data: inventoryCategories.map(cat =>
          inventory.filter(i => (i.nombre_categoria || "Sin categoría") === cat).length
        ),
        backgroundColor: "#9b59b6"
      }
    ]
  };

  const captureChartImage = (chartRef) => {
    const chartInstance = chartRef.current?.chart || chartRef.current;
    const canvas =
      chartRef.current?.canvasEl ||
      chartRef.current?.canvas ||
      chartRef.current?.chart?.canvas ||
      chartInstance?.canvas;

    if (!chartInstance || !canvas) {
      return null;
    }

    const options = chartInstance.options || {};
    const legendLabels = options.plugins?.legend?.labels;
    const titleOptions = options.plugins?.title;
    const xTicks = options.scales?.x?.ticks;
    const yTicks = options.scales?.y?.ticks;

    const previousColors = {
      legend: legendLabels?.color,
      title: titleOptions?.color,
      xTicks: xTicks?.color,
      yTicks: yTicks?.color
    };

    if (legendLabels) legendLabels.color = chartExportColor;
    if (titleOptions) titleOptions.color = chartExportColor;
    if (xTicks) xTicks.color = chartExportColor;
    if (yTicks) yTicks.color = chartExportColor;

    chartInstance.update("none");
    const img = canvas.toDataURL("image/png", 1.0);

    if (legendLabels) legendLabels.color = previousColors.legend;
    if (titleOptions) titleOptions.color = previousColors.title;
    if (xTicks) xTicks.color = previousColors.xTicks;
    if (yTicks) yTicks.color = previousColors.yTicks;

    chartInstance.update("none");

    return img;
  };

  // -------------------------------------------------------
  // 🔥 PDF 1 — CATEGORÍAS
  // -------------------------------------------------------
  const generatePDFCategorias = () => {
    if (!startDate || !endDate) {
      alert("Selecciona fecha de inicio y fin para generar el PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Reporte de Categorías (${startDate} - ${endDate})`, 14, 20);

    const filtered = transactions.filter(t => t.date >= startDate && t.date <= endDate);

    const grouped = {};
    filtered.forEach(t => {
      if (!grouped[t.category]) grouped[t.category] = 0;
      grouped[t.category] += t.amount;
    });

    const bodyData = Object.keys(grouped).map(cat => [cat, grouped[cat].toFixed(2)]);

    let finalY = 30;

    autoTable(doc, {
      startY: 30,
      head: [["Categoría", "Monto"]],
      body: bodyData,
      didDrawCell: (data) => {
        if (data.row.index === bodyData.length - 1 && data.column.index === 1) {
          finalY = data.cell.y + data.cell.height;
        }
      }
    });

    const imgData = captureChartImage(categoryChartRef);

    if (imgData) {
      doc.text("Gráfico de Ingresos por Categoría", 14, finalY + 10);
      doc.addImage(imgData, "PNG", 10, finalY + 20, 190, 110);
    }

    doc.save(`reporte_categorias_${startDate}_a_${endDate}.pdf`);
  };

  // -------------------------------------------------------
  // 🔥 PDF 2 — INGRESOS TOTALES
  // -------------------------------------------------------
  const generatePDFIngresos = () => {
    if (!startDate || !endDate) {
      alert("Selecciona fecha de inicio y fin.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Ingresos Totales (${startDate} - ${endDate})`, 14, 20);

    const filtered = transactions.filter(t => t.date >= startDate && t.date <= endDate);

    const total = filtered.reduce((sum, t) => sum + t.amount, 0);

    let finalY = 30;

    autoTable(doc, {
      startY: 30,
      head: [["Descripción", "Monto"]],
      body: [["Ingresos Totales", total.toFixed(2)]],
      didDrawCell: (data) => {
        finalY = data.cell.y + data.cell.height;
      }
    });

    const img = captureChartImage(salesChartRef);

    if (img) {
      doc.text("Gráfico de Ingresos", 14, finalY + 10);
      doc.addImage(img, "PNG", 10, finalY + 20, 190, 110);
    }

    doc.save(`reporte_ingresos_${startDate}_a_${endDate}.pdf`);
  };

  // -------------------------------------------------------
  // 🔥 PDF 3 — TRANSACCIONES DETALLADAS
  // -------------------------------------------------------
  const generatePDFTransacciones = () => {
    if (!startDate || !endDate) {
      alert("Selecciona las fechas.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Transacciones (${startDate} - ${endDate})`, 14, 20);

    const filtered = transactions.filter(t => t.date >= startDate && t.date <= endDate);

    const body = filtered.map(t => [
      t.id,
      t.date,
      t.category,
      t.amount.toFixed(2)
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["ID", "Fecha", "Categoría", "Monto"]],
      body
    });

    doc.save(`reporte_transacciones_${startDate}_a_${endDate}.pdf`);
  };

  // -------------------------------------------------------
  // 🔥 PDF 4 — INVENTARIO (NUEVO)
  // -------------------------------------------------------
  const generatePDFInventario = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Inventario de Productos", 14, 20);

    const body = inventory.map(p => [
      p.id_producto,
      p.nombre_producto,
      p.descripcion,
      p.nombre_categoria || "Sin categoría",
      Number(p.precio).toFixed(2)
    ]);

    let finalY = 30;

    autoTable(doc, {
      startY: 30,
      head: [["ID", "Producto", "Descripción", "Categoría", "Precio"]],
      body,
      didDrawCell: (data) => {
        finalY = data.cell.y + data.cell.height;
      }
    });

    const img = captureChartImage(inventoryChartRef);

    if (img) {
      doc.text("Gráfico de Productos por Categoría", 14, finalY + 10);
      doc.addImage(img, "PNG", 10, finalY + 20, 190, 110);
    }

    doc.save("reporte_inventario.pdf");
  };

  // -------------------------------------------------------

  return (
    <div className="layout">
      <Sidebar />

      <main className="reports">
        <header className="reports-header">
          <div className="reports-header__title">
            <h1>Reportes de e-commerce</h1>
            <p>Analiza el rendimiento de las ventas y exporta información clave en un solo lugar.</p>
          </div>
        </header>

        <section className="reports-toolbar">
          <div className="date-range">
            <div className="field">
              <label htmlFor="report-start-date">Fecha inicio</label>
              <input
                id="report-start-date"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="report-end-date">Fecha fin</label>
              <input
                id="report-end-date"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="toolbar-actions">
            <button className="btn-pdf" onClick={generatePDFCategorias}>PDF Categorías</button>
            <button className="btn-pdf" onClick={generatePDFIngresos}>PDF Ingresos Totales</button>
            <button className="btn-pdf" onClick={generatePDFTransacciones}>PDF Detalle de Transacciones</button>
            <button className="btn-pdf" onClick={generatePDFInventario}>PDF Inventario</button>
          </div>
        </section>

        {loading ? (
          <div className="reports-state" role="status" aria-live="polite">
            <span className="loader" aria-hidden="true" />
            <p>Cargando información más reciente…</p>
          </div>
        ) : (
          <section className="reports-charts">
            <div className="chart-box">
              <div className="chart-box__header">
                <h3>Ingresos Totales</h3>
                <span>Valor bruto generado por día</span>
              </div>
              <Bar
                ref={salesChartRef}
                data={salesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  devicePixelRatio: 3,
                  plugins: {
                    legend: { labels: { color: chartDisplayColor } },
                    title: { color: chartDisplayColor }
                  },
                  scales: {
                    x: { ticks: { color: chartDisplayColor } },
                    y: { ticks: { color: chartDisplayColor } }
                  }
                }}
              />
            </div>

            <div className="chart-box">
              <div className="chart-box__header">
                <h3>Ingresos por Categoría</h3>
                <span>Comparativa de desempeño por línea</span>
              </div>
              <Bar
                ref={categoryChartRef}
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  devicePixelRatio: 3,
                  plugins: {
                    legend: { labels: { color: chartDisplayColor } },
                    title: { color: chartDisplayColor }
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: chartDisplayColor,
                        maxRotation: 45,
                        minRotation: 0
                      }
                    },
                    y: { ticks: { color: chartDisplayColor } }
                  }
                }}
              />
            </div>

            <div className="chart-box">
              <div className="chart-box__header">
                <h3>Inventario</h3>
                <span>Productos totales por categoría</span>
              </div>
              <Bar
                ref={inventoryChartRef}
                data={inventoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  devicePixelRatio: 3,
                  plugins: {
                    legend: { labels: { color: chartDisplayColor } }
                  },
                  scales: {
                    x: { ticks: { color: chartDisplayColor } },
                    y: { ticks: { color: chartDisplayColor } }
                  }
                }}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
