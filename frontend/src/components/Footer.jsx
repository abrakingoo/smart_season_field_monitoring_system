export default function Footer() {
  return (
    <footer className="text-xs text-center py-4 mt-auto" style={{ backgroundColor: '#e8e4dc', borderTop: '1px solid #d4cfc6', color: '#8a8278' }}>
      © {new Date().getFullYear()} ShambaRecords · Field Monitoring System
    </footer>
  )
}
