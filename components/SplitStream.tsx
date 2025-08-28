'use client'

import { TokenStreamView } from './TokenStreamView'

export function SplitStream({ leftTitle, rightTitle, leftText, rightText, done } : {
  leftTitle: string
  rightTitle: string
  leftText: string
  rightText: string
  done?: boolean
}) {
  return (
    <>
      <TokenStreamView title={leftTitle} text={leftText} done={done} />
      <TokenStreamView title={rightTitle} text={rightText} done={done} />
    </>
  )
}
