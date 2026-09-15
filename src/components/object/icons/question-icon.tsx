import * as React from 'react'
import type { ObjectIconProps } from '@/lib/object'
import { ObjectIcon } from './object-icon'

export const QuestionIcon = React.forwardRef<SVGSVGElement, ObjectIconProps>(
  function QuestionIcon(props, ref) {
    return (
      <ObjectIcon ref={ref} data-icon="question" {...props}>
        <path
          fill="currentColor"
          d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm0-152a40,40,0,0,0-40,40,8,8,0,0,0,16,0,24,24,0,1,1,24,24,8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-1.37A40,40,0,0,0,128,64Zm0,104a8,8,0,1,0,8,8A8,8,0,0,0,128,168Z"
        />
      </ObjectIcon>
    )
  },
)

QuestionIcon.displayName = 'QuestionIcon'
export const ObjectQuestionIcon = QuestionIcon
