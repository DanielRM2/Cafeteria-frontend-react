import { useState, useEffect } from 'react';
import { CirclesWithBar } from 'react-loader-spinner';

export default function SpinnerInterno() {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length < 3 ? prev + '.' : ''));
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            marginTop: "5%"
        }}>
            <CirclesWithBar
                height="100"
                width="100"
                color="#006ce6"
                outerCircleColor="#006ce6"
                innerCircleColor="#2e7cd5"
                barColor="#006ce6"
                ariaLabel="circles-with-bar-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
            <p style={{
                marginTop: "14px",
                fontSize: "1.2rem",
                color: "#006ce6"
            }}>
                Cargando{dots}
            </p>
        </div>
    );
}