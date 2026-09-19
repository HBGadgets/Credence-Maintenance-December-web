import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const usePermissionStore = create(
  persist(
    (set) => ({
      permissions: null,
      setPermissions: (permissions) => set({ permissions }),
      clearPermissions: () => set({ permissions: null }),
    }),
    {
      name: 'worker-permissions',
    },
  ),
)

export default usePermissionStore
