import React from 'react'

import { ReactNode } from 'react';
import ReduxProvider from '../todo/ReduxProvider';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <ReduxProvider>
    <div>{children}</div>
    </ReduxProvider>
  )
}

export default layout