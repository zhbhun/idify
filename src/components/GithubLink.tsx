import 'github-fork-ribbon-css/gh-fork-ribbon.css'
import Link from '@mui/material/Link'

export function GithubLink() {
  return (
    <Link
      className="github-fork-ribbon z-0"
      sx={{
        '&::before': {
          backgroundColor: '#0ea5e9 !important',
        },
      }}
      href="https://github.com/zhbhun/idify"
      data-ribbon="Fork me on GitHub"
      title="Fork me on GitHub"
      target="_blank"
    />
  )
}

export default GithubLink
