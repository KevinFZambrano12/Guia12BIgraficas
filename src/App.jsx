import Chart1_AvgPriceByBrand from "./charts/Chart1_AvgPriceByBrand";
import Chart2_AvgRamByBrand from "./charts/Chart2_AvgRamByBrand";
import Chart3_AvgBatteryByBrand from "./charts/Chart3_AvgBatteryByBrand";
import Chart4_PriceHistogram from "./charts/Chart4_PriceHistogram";
import Chart5_RamHistogram from "./charts/Chart5_RamHistogram";
import Chart6_PriceVsRam from "./charts/Chart6_PriceVsRam";
import Chart7_PriceVsBattery from "./charts/Chart7_PriceVsBattery";
import Chart8_BoxplotPriceByBrand from "./charts/Chart8_BoxplotPriceByBrand";
import Chart9_PieOS from "./charts/Chart9_PieOS";
import Chart10_Radar from "./charts/Chart10_Radar";

// Importa el CSS global **solo aquí o en main.jsx**
import "./App.css"

export default function App() {
    return (
        <div className="dashboard">

            <div className="card">
                <Chart1_AvgPriceByBrand />
            </div>

            <div className="card">
                <Chart2_AvgRamByBrand />
            </div>

            <div className="card">
                <Chart3_AvgBatteryByBrand />
            </div>

            <div className="card">
                <Chart4_PriceHistogram />
            </div>

            <div className="card">
                <Chart5_RamHistogram />
            </div>

            <div className="card">
                <Chart6_PriceVsRam />
            </div>

            <div className="card">
                <Chart7_PriceVsBattery />
            </div>

            <div className="card">
                <Chart8_BoxplotPriceByBrand />
            </div>

            <div className="card">
                <Chart9_PieOS />
            </div>

            <div className="card">
                <Chart10_Radar />
            </div>

        </div>
    );
}
