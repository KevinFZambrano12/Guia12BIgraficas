import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import useMobileData from "./useMobileData";

export default function Chart2_AvgRamByBrand() {
    const data = useMobileData();
    const ref = useRef();

    useEffect(() => {
        if (data.length === 0) return;

        // Agrupar RAM promedio por marca
        const grouped = d3.rollup(data, v => d3.mean(v, d => d.ram), d => d.brand);
        const dataset = Array.from(grouped, ([brand, avg_ram]) => ({ brand, avg_ram }));

        const width = 600, height = 350;
        const margin = { top: 40, right: 20, bottom: 60, left: 60 };

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();
        svg.attr("width", width).attr("height", height);

        const x = d3.scaleBand()
            .domain(dataset.map(d => d.brand))
            .range([margin.left, width - margin.right])
            .padding(0.25);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.avg_ram)])
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.avg_ram)])
            .range(["#6A5AE0", "#4ADEDE"]);

        // Dibujar barras con animación
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", d => x(d.brand))
            .attr("y", height - margin.bottom) // inicia abajo
            .attr("width", x.bandwidth())
            .attr("height", 0) // animación
            .attr("fill", d => color(d.avg_ram))
            .transition()
            .duration(800)
            .attr("y", d => y(d.avg_ram))
            .attr("height", d => height - margin.bottom - y(d.avg_ram));

        // Ejes
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

    }, [data]);

    return (
        <div>
            <h3 style={{ textAlign: "center" }}>RAM Promedio por Marca</h3>
            <svg ref={ref}></svg>
        </div>
    );
}