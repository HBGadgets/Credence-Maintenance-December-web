import React from 'react'
import { AppContent, AppHeader, AppSidebar } from '../components/index'

const DefaultLayout = () => {
  const dispatch = useDispatch()
  const activeSection = useSelector((state) => state.activeSection || 'Dashboard')
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const token = Cookies.get('crdnsMaintToken') || useContext(TokenContext)
  const userRole = useMemo(() => {
    if (!token || typeof token !== 'string') return null
    try {
      return jwtDecode(token)?.role || null
    } catch {
      return null
    }
  }, [token])

  const filteredNav = useMemo(() => filterNavByRole(navigation, userRole), [userRole])
  const currentSection = useMemo(() => {
    return filteredNav.find(
      (item) => item.name && item.name.trim().toLowerCase() === activeSection.trim().toLowerCase()
    )
  }, [filteredNav, activeSection])

  const hasSubItems = Boolean(currentSection?.items && currentSection.items.length > 0)

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <AppHeader />
      <div className="d-flex flex-grow-1 position-relative">
        <AppSidebar />
        <div className="body flex-grow-1 px-3 py-3 position-relative" style={{ minWidth: 0 }}>
          <AppContent />
        </div>
      </div>
      {/* <AppFooter /> */}
    </div>
  )
}

export default React.memo(DefaultLayout)
