import 'bootstrap-icons/font/bootstrap-icons.css'

function Star(props){
    // Làm tròn xuống và giới hạn số sao trong khoảng 0-5
    const fullStars = Math.floor(Math.max(0, Math.min(5, props.st))); // Số sao vàng
    const emptyStars = 5 - fullStars; // Số sao trống

    return (
        <span>
            {/* Render sao vàng */}
            {[...Array(fullStars)].map((_, i) => (
                <i 
                    key={`filled-${i}`} 
                    className="text-warning bi bi-star-fill" 
                    style={{ paddingRight: '3px', fontSize: '15px' }}
                ></i>
            ))}

            {/* Render sao trống */}
            {[...Array(emptyStars)].map((_, i) => (
                <i 
                    key={`empty-${i}`} 
                    className="bi bi-star-fill" 
                    style={{ color: "#d9d9d9", paddingRight: '3px', fontSize: '15px' }}
                ></i>
            ))}
        </span>
    )
}

export default Star
