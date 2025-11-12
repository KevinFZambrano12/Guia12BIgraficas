import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useMobileData from "./useMobileData";
import ModelSelector from "../components/ModelSelector";

export default function Chart10_Radar() {
    const data = useMobileData();
    const ref = useRef();

    const [modelA, setModelA] = useState("");
    const [modelB, setModelB] = useState("");

    // construimos lista de modelos únicos con id robusto: `${brand} | ${model}`
    const models = Array.from(
        new Map(
            data.map(d => [`${d.brand} | ${d.model}`, { id: `${d.brand} | ${d.model}`, label: `${d.brand} — ${d.model}` }])
        ).values()
    );

    useEffect(() => {
        if (!modelA || !modelB) {
            // limpiar svg si no hay selección
            d3.select(ref.current).selectAll("*").remove();
            return;
        }

        const sel = data.filter(d => `${d.brand} | ${d.model}` === modelA || `${d.brand} | ${d.model}` === modelB);
        if (sel.length < 2) {
            d3.select(ref.current).selectAll("*").remove();
            return;
        }

        // Métricas que vamos a comparar
        const metrics = [
            { key: "price", label: "Precio (USD)" },
            { key: "ram", label: "RAM (GB)" },
            { key: "storage", label: "Storage (GB)" },
            { key: "battery", label: "Batería (mAh)" }
        ];

        // Normalizar por max global (para que comparación sea relativa)
        const maxes = {};
        metrics.forEach(m => {
            maxes[m.key] = d3.max(data, d => d[m.key]) || 1;
        });

        const width = 480;
        const height = 480;
        const radius = Math.min(width, height) / 2 - 40;
        const center = { x: width / 2, y: height / 2 };

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();
        svg.attr("width", width).attr("height", height);

        const g = svg.append("g").attr("transform", `translate(${center.x},${center.y})`);

        // escalas angulares
        const angleSlice = (Math.PI * 2) / metrics.length;

        // dibujar círculos concéntricos (grid)
        const levels = 4;
        const gridGroup = g.append("g").attr("class", "grid");
        for (let lvl = 1; lvl <= levels; lvl++) {
            gridGroup.append("circle")
                .attr("r", (radius / levels) * lvl)
                .attr("fill", "none")
                .attr("stroke", "rgba(100,100,110,0.08)")
                .attr("stroke-width", 1);
        }

        // labels de ejes
        const axis = g.append("g").attr("class", "axis");
        metrics.forEach((m, i) => {
            const angle = i * angleSlice - Math.PI / 2;
            const x = Math.cos(angle) * (radius + 16);
            const y = Math.sin(angle) * (radius + 16);

            axis.append("text")
                .attr("x", x)
                .attr("y", y)
                .attr("text-anchor", x < -6 ? "end" : x > 6 ? "start" : "middle")
                .attr("dominant-baseline", "central")
                .style("font-size", "11px")
                .style("fill", "black")
                .text(m.label);
        });

        // función que construye los puntos normalizados para un objeto
        const radialPoints = (d) => {
            return metrics.map((m, i) => {
                const value = d[m.key] || 0;
                const r = (value / maxes[m.key]) * radius;
                const angle = i * angleSlice - Math.PI / 2;
                return [Math.cos(angle) * r, Math.sin(angle) * r];
            });
        };

        const colors = ["#00E5FF", "#A266FF"];

        // dibujar polígonos para cada selección
        sel.forEach((phone, idx) => {
            const pts = radialPoints(phone);

            // area (fill) con transparencia
            const fillColor = d3.color(colors[idx]);
            fillColor.opacity = 0.12;
            const strokeColor = colors[idx];

            g.append("polygon")
                .attr("points", pts.map(p => p.join(",")).join(" "))
                .attr("fill", fillColor.formatRgb ? fillColor.formatRgb() : fillColor.toString())
                .attr("stroke", strokeColor)
                .attr("stroke-width", 2)
                .style("filter", "drop-shadow(0px 0px 10px rgba(0,230,255,0.12))");

            // puntos neon
            g.selectAll(`.dot-${idx}`)
                .data(pts)
                .enter()
                .append("circle")
                .attr("class", "neon-dot")
                .attr("cx", d => d[0])
                .attr("cy", d => d[1])
                .attr("r", 5)
                .attr("fill", strokeColor)
                .attr("opacity", 0.95);
        });

        // leyenda
        const legend = svg.append("g")
            .attr("transform", `translate(${20}, ${20})`);
        sel.forEach((p, i) => {
            const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
            legendRow.append("rect")
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill", colors[i])
                .attr("rx", 2);
            legendRow.append("text")
                .attr("x", 18)
                .attr("y", 10)
                .style("fill", "black")
                .style("font-size", "12px")
                .text(`${p.brand} — ${p.model}`);
        });

    }, [modelA, modelB, data]);

    return (
        <div>
            <h3 style={{ color: "black" }}>Comparación entre Modelos (Radar)</h3>
            <ModelSelector
                models={models}
                selectedA={modelA}
                selectedB={modelB}
                setA={setModelA}
                setB={setModelB}
            />
            <svg ref={ref}></svg>
        </div>
    );
}


