import { ReactNode } from 'react'

const layout = ({children}: {children: ReactNode}) => {
  return (
    <div className='w-full flex-1 flex items-center justify-center'>{children}</div>
  )
}

export default layout