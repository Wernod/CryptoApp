import {useState, useEffect} from "react";
import {Link} from "react-router-dom";

const ReviewCrypto = () => {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const response = await fetch("http://localhost:5200/api/cryptos");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setCryptos(data.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchCryptos();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <ul>
                <div style={{ maxWidth: "100%", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                            <th style={{ padding: "10px" }}>Назва</th>
                            <th style={{ padding: "10px" }}>Остання ціна</th>
                            <th style={{ padding: "10px" }}>Зміна за добу</th>
                            <th style={{ padding: "10px" }}>Ринкова капіталізація</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cryptos.map((crypto) => (
                            <tr key={crypto.id} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "10px", display: "flex", alignItems: "center" }}>
                                    <span><Link to={`/review/${crypto.id}`}>{crypto.symbol}</Link></span>
                                </td>
                                <td style={{ padding: "10px" }}>{crypto.quote.USD.price.toFixed(2)}</td>
                                <td style={{ padding: "10px", color: crypto.quote.USD.percent_change_24h > 0 ? "green" : "red" }}>
                                    {crypto.quote.USD.percent_change_24h.toFixed(2)}
                                </td>
                                <td style={{ padding: "10px" }}>
                                    {crypto.quote.USD.market_cap.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </ul>
        </>
    );
};

export default ReviewCrypto
