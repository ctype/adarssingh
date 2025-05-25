import { useEffect, useState } from "react"

export const useWindowResize = ({ size }: { size: number }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth > size) {
        setIsNavbarOpen(false)
      }
    }

    window.addEventListener('resize', handleWindowResize)

    return () => window.removeEventListener('resize', handleWindowResize)
  }, [size])

  return { isNavbarOpen, setIsNavbarOpen };
}
