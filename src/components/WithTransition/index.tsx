import { useEffect } from 'react'
import { useTransition } from '../../context/TransitionContext'

export function withTransition<T extends {}>(
  WrappedComponent: React.ComponentType<T>
) {
  // Try to create a nice displayName for React Dev Tools.
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'

  // Creating the inner component. The calculated Props type here is the where the magic happens.
  const ComponentWithTransition = (props: T) => {
    const { appearTransition, closeTransition } = useTransition()

    useEffect(() => {
      appearTransition()
      return closeTransition
    }, [appearTransition, closeTransition])

    return <WrappedComponent {...(props as T)} />
  }

  ComponentWithTransition.displayName = `withTransition(${displayName})`

  return ComponentWithTransition
}
