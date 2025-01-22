import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";


function Coin() {
    const { id } = useParams(); // Отримуємо `id` криптовалюти з URL
    const [crypto, setCrypto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dateAdded = crypto ? new Date(crypto.date_added) : null;
    const year = dateAdded ? dateAdded.getFullYear() : null;
    const month = dateAdded ? dateAdded.getMonth() : null;

    useEffect(() => {
        const fetchCryptoDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5200/api/cryptos/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setCrypto(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchCryptoDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!crypto) {
        return <div>No data found for this cryptocurrency.</div>;
    }
    return (
        <>
            <div className=" bg-base-200 min-h-screen">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className=" mt-12 text-5xl font-bold">{crypto.name}</h1>
                        <h3 className="py-6">Дата запуску {crypto.symbol} на крипторинку: {year}-{month}</h3>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Coin;