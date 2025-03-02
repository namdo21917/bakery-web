function Currency({ amount, fontSize = 20 }) {
    const amountFormatted = new Intl.NumberFormat('vi-VN').format(amount);

    return (
        <>
            <span className="fw-medium" style={{ fontSize: `${fontSize}px` }}>
                {amountFormatted}
            </span>
            <span
                className="fw-medium"
                style={{
                    fontSize: `${fontSize * 0.725}px`, 
                    verticalAlign: 'super',
                    paddingLeft: '2px',
                }}
            >
                ₫
            </span>
        </>
    );
}

export default Currency;
