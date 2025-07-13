import React, { useEffect, useState } from "react";
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { fetchDataSimple } from "../utils/api.js";

export default function DashboardResumen() {
  // Estados para datos
  const [ventas, setVentas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchDataSimple("/api/ventas/listar"),
      fetchDataSimple("/api/pedidos/listar"),
      fetchDataSimple("/api/pagos/listar"),
      fetchDataSimple("/api/productos/listar"),
      fetchDataSimple("/api/cliente/listar")
    ])
        .then(([ventas, pedidos, pagos, productos, clientes]) => {
          setVentas(ventas);
          setPedidos(pedidos);
          setPagos(pagos);
          setProductos(productos);
          setClientes(clientes);
        })
        .finally(() => setLoading(false));
  }, []);

  // --- KPIs ---
  // Formatear fecha actual
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Establecer a inicio del día

  // Ventas hoy
  const ventasHoy = ventas.filter(v => {
    if (!v.fechaVenta) return false;
    const fechaVenta = new Date(v.fechaVenta);
    return fechaVenta.setHours(0, 0, 0, 0) === hoy.getTime();
  });

  // Órdenes hoy
  const pedidosHoy = pedidos.filter(p => {
    if (!p.fechaPedido) return false;
    const fechaPedido = new Date(p.fechaPedido);
    return fechaPedido.setHours(0, 0, 0, 0) === hoy.getTime();
  });

  // Total de clientes
  const totalClientes = clientes.length;

  // Ingresos hoy
  const ingresosHoy = ventasHoy.reduce((acc, v) => {
    const total = Number(v.total) || 0;
    return acc + total;
  }, 0);

  const kpis = [
    { label: "Ventas hoy", value: ventasHoy.length, color: "from-blue-400 to-blue-600" },
    { label: "Órdenes hoy", value: pedidosHoy.length, color: "from-green-400 to-green-600" },
    { label: "Clientes registrados", value: totalClientes, color: "from-purple-400 to-purple-600" },
    { label: "Ingresos (S/)", value: ingresosHoy.toFixed(2), color: "from-yellow-400 to-yellow-600" },
  ];

  // --- Gráfico ventas por día (últimos 7 días) ---
  const dias = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const ventasLineData = [
    {
      id: "Ventas",
      data: dias.map(fecha => ({
        x: fecha.slice(5), // MM-DD
        y: ventas.filter(v => v.fechaVenta && v.fechaVenta.slice(0, 10) === fecha).length
      }))
    }
  ];

  // --- Órdenes por estado (pie) ---
  // Detectar estados únicos de los pedidos
  const estadosUnicos = Array.from(new Set(pedidos.map(p => (p.estado || '').trim().toUpperCase()).filter(Boolean)));
  const pedidosPieData = estadosUnicos.map(est => ({
    id: est,
    label: est.charAt(0) + est.slice(1).toLowerCase(),
    value: pedidos.filter(p => (p.estado || '').trim().toUpperCase() === est).length
  })).filter(d => d.value > 0);

  // --- Top productos vendidos (bar) ---
  // Sumar ventas por producto recorriendo pedidos -> detalles[] -> idProducto
  const ventasPorProducto = {};
  pedidos.forEach(p => {
    if (Array.isArray(p.detalles)) {
      p.detalles.forEach(detalle => {
        if (detalle.idProducto) {
          ventasPorProducto[detalle.idProducto] = (ventasPorProducto[detalle.idProducto] || 0) + (detalle.cantidad || 1);
        }
      });
    }
  });
  const topProductos = Object.entries(ventasPorProducto)
      .map(([id, ventas]) => ({
        producto: productos.find(p => String(p.idProducto) === String(id))?.nombre || `ID ${id}`,
        ventas
      }))
      .sort((a, b) => b.ventas - a.ventas)
      .slice(0, 5);
  const topProductosBarData = topProductos.length > 0 ? topProductos : [{ producto: "Sin datos", ventas: 0 }];

  // --- Métodos de entrega más usados (pie) ---
  // Contar ocurrencias de cada método de entrega en pedidos
  const metodosEntrega = Array.from(new Set(pedidos.map(p => p.metodoEntrega).filter(Boolean)));
  const metodosEntregaPieData = metodosEntrega.map(met => ({
    id: met,
    label: met,
    value: pedidos.filter(p => p.metodoEntrega === met).length
  })).filter(d => d.value > 0);

  return (

      <div className="w-full px-2 md:px-6 py-6">
        {loading ? (
            <div className="text-center text-gray-500 py-16 text-lg">Cargando dashboard...</div>
        ) : (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {kpis.map(kpi => (
                    <div key={kpi.label}
                         className={`bg-gradient-to-r ${kpi.color} text-white rounded-xl shadow-lg p-6 flex flex-col items-center`}>
                      <span className="text-3xl font-bold mb-1">{kpi.value}</span>
                      <span className="text-lg font-medium opacity-90">{kpi.label}</span>
                    </div>
                ))}
              </div>

              {/* Gráficos principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Ventas por día */}
                <div className="bg-white rounded-xl shadow p-4 h-96 flex flex-col">
                  <h3 className="font-semibold text-blue-700 mb-2">Ventas por día</h3>
                  <div className="flex-1">
                    <ResponsiveLine
                        data={ventasLineData}
                        margin={{top: 20, right: 20, bottom: 40, left: 50}}
                        xScale={{type: 'point'}}
                        yScale={{type: 'linear', min: 'auto', max: 'auto', stacked: false}}
                        axisBottom={{
                          tickSize: 5,
                          tickPadding: 5,
                          legend: 'Día',
                          legendOffset: 32,
                          legendPosition: 'middle'
                        }}
                        axisLeft={{
                          tickSize: 5,
                          tickPadding: 5,
                          legend: 'Ventas',
                          legendOffset: -40,
                          legendPosition: 'middle'
                        }}
                        colors={["#2563eb"]}
                        pointSize={10}
                        pointColor="#2563eb"
                        pointBorderWidth={2}
                        pointBorderColor={{from: 'serieColor'}}
                        enableArea={true}
                        areaOpacity={0.15}
                        useMesh={true}
                        theme={{
                          fontFamily: 'Inter, sans-serif',
                          textColor: '#1e293b',
                          axis: {legend: {text: {fontWeight: 600}}},
                        }}
                    />
                  </div>
                </div>
                {/* Órdenes por estado */}
                <div className="bg-white rounded-xl shadow p-4 h-96 flex flex-col">
                  <h3 className="font-semibold text-blue-700 mb-2">Órdenes por estado</h3>
                  <div className="flex-1">
                    <ResponsivePie
                        data={pedidosPieData}
                        margin={{top: 20, right: 20, bottom: 40, left: 20}}
                        innerRadius={0.5}
                        padAngle={2}
                        cornerRadius={4}
                        colors={["#22c55e", "#facc15", "#ef4444"]}
                        borderWidth={1}
                        borderColor={{from: 'color', modifiers: [['darker', 0.2]]}}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#64748b"
                        arcLabelsTextColor="#334155"
                        theme={{fontFamily: 'Inter, sans-serif'}}
                        legends={[]}
                    />
                  </div>
                </div>
              </div>

              {/* Gráficos secundarios */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Top productos */}
                <div className="bg-white rounded-xl shadow p-4 h-96 flex flex-col">
                  <h3 className="font-semibold text-blue-700 mb-2">Top productos vendidos</h3>
                  <div className="flex-1">
                    <ResponsiveBar
                        data={topProductosBarData}
                        keys={["ventas"]}
                        indexBy="producto"
                        margin={{top: 20, right: 20, bottom: 100, left: 60}} // ⬅ más espacio inferior
                        padding={0.3}
                        colors={({index}) => ["#ff2600", "#7c3aed", "#22c55e", "#0ea5e9", "#f43f5e", "#facc15", "#2563eb", "#a21caf"][index % 8]}
                        axisBottom={{
                          tickSize: 5,
                          tickPadding: 5,
                          legend: 'Producto',
                          legendOffset: 90,
                          legendPosition: 'middle',
                          tickRotation: -35,
                        }}
                        axisLeft={{
                          tickSize: 5,
                          tickPadding: 5,
                          legend: 'Ventas',
                          legendOffset: -50,
                          legendPosition: 'middle'
                        }}
                        theme={{
                          fontFamily: 'Inter, sans-serif',
                          textColor: '#1e293b',
                          axis: {legend: {text: {fontWeight: 600}}},
                        }}
                        borderRadius={4}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor="#fff"
                        animate={true}
                    />
                  </div>
                </div>
                {/* Métodos de entrega más usados */}
                <div className="bg-white rounded-xl shadow p-4 h-96 flex flex-col">
                  <h3 className="font-semibold text-blue-700 mb-2">Métodos de entrega más usados</h3>
                  <div className="flex-1">
                    <ResponsivePie
                        data={metodosEntregaPieData}
                        margin={{top: 20, right: 20, bottom: 40, left: 20}}
                        innerRadius={0.5}
                        padAngle={2}
                        cornerRadius={4}
                        colors={["#00c5c5", "#25eb35", "#22d3ee", "#facc15", "#22c55e"]}
                        borderWidth={1}
                        borderColor={{from: 'color', modifiers: [['darker', 0.2]]}}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#64748b"
                        arcLabelsTextColor="#334155"
                        theme={{fontFamily: 'Inter, sans-serif'}}
                        legends={[]}
                    />
                  </div>
                </div>
              </div>
            </>
        )}
      </div>
  );
}
