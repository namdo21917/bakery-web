
function Comment({ data }) {
    return (
        <>
            <div className="mt-2">
                <p className="mb-1" style={{color: '#000066'}}>{data.author}</p>
                <p>{data.content}</p>
            </div>
        </>
    )
}

export default Comment