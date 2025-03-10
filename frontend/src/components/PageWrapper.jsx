function PageWrapper({ children }) {
    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f2e8' }}>
            {children}
        </div>
    )
}

export default PageWrapper 