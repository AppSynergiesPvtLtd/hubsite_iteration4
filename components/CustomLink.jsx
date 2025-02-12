import { useRouter } from "next/router"
import Link from "next/link"

const CustomLink = ({ href, children, ...props }) => {
  const router = useRouter()

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <Link href={href} {...props} onClick={handleClick}>
      {children}
    </Link>
  )
}

export default CustomLink

