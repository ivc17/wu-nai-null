/* eslint-disable react/jsx-no-undef */
import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect
} from 'react'
import { useNavigate } from 'react-router-dom'
import { GlyphsList } from '../assets/glyphsList'
import Transition from '../components/Transition'

export const smCount = 4
export const lgCount = 5
export const xlCount = 10

interface TransitionContextType {
  appearTransition: () => void
  closeTransition: () => void
  wrappedNavigate: (path: string) => void
}

export const TransitionContext = React.createContext<TransitionContextType>({
  appearTransition: () => {},
  closeTransition: () => {},
  wrappedNavigate: () => {}
})

export const TransitionProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [repeatCount, setRepeatCount] = useState([1])
  const [appear, setAppear] = useState<boolean>(false)
  const [disappear, setDisappear] = useState<boolean>(false)
  const navigate = useNavigate()
  const interval = repeatCount.length > 2 ? 0.01 : 0.03

  const getRepeatCount = useCallback(() => {
    let repeat = 1

    if (window.innerHeight < 600) {
      const itemWidth = window.innerWidth / smCount
      const verticalCount = Math.ceil(window.innerHeight / itemWidth)
      repeat = (verticalCount * smCount) / GlyphsList.length
    } else if (window.innerHeight < 1200) {
      const itemWidth = window.innerWidth / lgCount
      const verticalCount = Math.ceil(window.innerHeight / itemWidth)
      repeat = (verticalCount * lgCount) / GlyphsList.length
    } else {
      const itemWidth = window.innerWidth / xlCount
      const verticalCount = Math.ceil(window.innerHeight / itemWidth)
      repeat = (verticalCount * xlCount) / GlyphsList.length
    }

    setRepeatCount(Array.from(Array(Math.ceil(repeat)).keys()))
  }, [])

  useEffect(() => {
    getRepeatCount()

    window.addEventListener('resize', getRepeatCount)
    return () => window.removeEventListener('resize', getRepeatCount)
  }, [getRepeatCount])

  const closeTransition = useCallback(() => {
    setDisappear(true)
    setAppear(false)
  }, [])

  const wrappedNavigate = useCallback(
    (path: string) => {
      setDisappear(true)
      setAppear(false)
      setTimeout(() => {
        navigate(path, {})
        setAppear(true)
        setDisappear(false)
      }, repeatCount.length * GlyphsList.length * interval * 1000)
    },
    [interval, navigate, repeatCount.length]
  )

  const appearTransition = useCallback(() => {
    setAppear(true)
    setDisappear(false)
  }, [])

  const val = useMemo(
    () => ({
      closeTransition,
      appearTransition,
      wrappedNavigate
    }),
    [closeTransition, appearTransition, wrappedNavigate]
  )

  return (
    <TransitionContext.Provider value={val}>
      {children}
      {disappear && (
        <Transition
          isAppearTransition={false}
          repeatCount={repeatCount}
          interval={interval}
        />
      )}
      {appear && (
        <Transition
          isAppearTransition={true}
          repeatCount={repeatCount}
          interval={interval}
        />
      )}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const context = useContext(TransitionContext)
  return context
}
