import * as React from 'react'
import type { ObjectIconProps } from '@/lib/object'

export const ObjectIcon = React.forwardRef<SVGSVGElement, ObjectIconProps>(
  function ObjectIcon({ children, className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 256 256"
        aria-hidden="true"
        role="img"
        className={className}
        {...props}
      >
        {children}
      </svg>
    )
  },
)

ObjectIcon.displayName = 'ObjectIcon'
