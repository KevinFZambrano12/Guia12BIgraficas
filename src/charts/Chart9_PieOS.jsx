import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useMobileData from "./useMobileData";

export default function Chart9_PieOS() {
    const data = useMobileData();
    const ref = useRef();

    useEffect(() => {
        if (data.length === 0) return;

        const counts = d3.rollup(data, v => v.length, d => d.os);
        const formatted = Array.from(counts, ([os, count]) => ({ os, count }));

        const width = 380, height = 380, radius = 160;

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();
        svg.attr("width", width).attr("height", height);

        const color = d3.scaleOrdinal(["#6A5AE0", "#4ADEDE"]);
        const pie = d3.pie().value(d => d.count)(formatted);
        const arc = d3.arc().outerRadius(radius).innerRadius(60);

        svg.append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`)
            .selectAll("path")
            .data(pie)
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.os))
            .style("filter", "drop-shadow(0px 0px 6px rgba(0,0,0,0.25))");

    }, [data]);

    return (
        <div>
            <h3>Distribución del Sistema Operativo</h3>
            <svg ref={ref}></svg>
        </div>
    );
}
