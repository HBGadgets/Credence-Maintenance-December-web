const StatusBadge = ({ status }) => {
  const getColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in-progress':
        return 'warning'
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return <span className={`badge bg-${getColor(status)} text-capitalize`}>{status}</span>
}

export default StatusBadge
