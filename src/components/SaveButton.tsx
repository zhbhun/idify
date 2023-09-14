import classNames from 'classnames'
import { HTMLAttributes, ReactElement, cloneElement } from 'react'
import { Box } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'

export interface CloseButtonProps extends HTMLAttributes<HTMLElement> {
  icon?: ReactElement
}

export function CloseButton({ className, icon, ...props }: CloseButtonProps) {
  return (
    <Box
      {...props}
      className={classNames(
        'absolute top-[14px] right-[14px] flex items-center justify-center w-[49px] h-[53px] cursor-pointer',
        className
      )}
    >
      <svg
        className="absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 49 53"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21.7671 0.936743C30.3107 -0.528265 39.6771 3.34824 45.007 10.1169C49.9772 16.4289 48.3826 25.2144 47.1065 33.1164C46.075 39.5035 43.7949 45.8495 38.6021 49.7773C33.9151 53.3226 27.648 52.744 21.7671 52.2831C16.5127 51.8714 11.3038 50.8399 7.40256 47.3323C3.30937 43.6521 0.810251 38.5776 0.449192 33.1164C0.062197 27.2628 2.14137 21.8157 5.39124 16.9099C9.75972 10.3157 13.9165 2.28291 21.7671 0.936743Z"
          fill="#3b82f6"
        />
      </svg>
      {icon ? (
        cloneElement(icon, {
          className: 'relative text-3xl text-white',
        })
      ) : (
        <SaveIcon className="relative text-3xl text-white" />
      )}
    </Box>
  )
}

export default CloseButton
