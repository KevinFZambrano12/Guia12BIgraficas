import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function useMobileData() {
    const [data, setData] = useState([]);

    useEffect(() => {
        d3.csv("public/data/mobiles.csv").then(raw => {
            const cleaned = raw.map(d => {
                // ✅ Limpieza correcta del almacenamiento
                let storageValue = (d.storage_gb || "").toString().trim();
                storageValue = storageValue.replace(/[^0-9]/g, ""); // quita texto como "GB" y espacios
                const storage = parseInt(storageValue, 10) || 0;

                return {
                    brand: d.brand,
                    model: d.model,
                    price: +d.price_usd,
                    ram: +d.ram_gb,
                    storage: storage, // ✅ Aquí ya viene limpio y numérico
                    camera: +d.camera_mp,
                    battery: +d.battery_mah,
                    display: +d.display_size_inch,
                    charging: +d.charging_watt,
                    os: d.os,
                    processor: d.processor,
                    rating: +d.rating,
                    release_month: d.release_month,
                    year: +d.year,
                };
            });

            setData(cleaned);
        });
    }, []);

    return data;
}
