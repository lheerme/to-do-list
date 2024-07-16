import { useMutation } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'

import { GoogleMark } from '@/assets/google-mark'
import { Button } from '@/components/ui/button'
import { loginWithGoogle } from '@/services/login-with-google'
import { useStore } from '@/store/use-store'

export function LoginWithGoogleButton() {
  const isLoggingIn = useStore((state) => state.isLoggingIn)
  const setIsLoggingIn = useStore((state) => state.setIsLoggingIn)
  const [isLoginWithGooglePending, setIsLoginWithGooglePending] =
    useState(false)

  const { mutateAsync: loginUserWithGoogle } = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: () => {
      setIsLoginWithGooglePending(true)
    },
  })

  async function handleSignInWithGoogle() {
    setIsLoggingIn(true)
    await loginUserWithGoogle()
  }

  return (
    <Button
      disabled={isLoginWithGooglePending || isLoggingIn}
      onClick={handleSignInWithGoogle}
      className="w-full"
    >
      {isLoginWithGooglePending ? (
        <LoaderCircle className="size-[1.2rem] animate-spin" />
      ) : (
        <>
          <GoogleMark className="mr-2 h-[1.3rem] w-[1.3rem] text-background" />{' '}
          <span className="pt-0.5">Entrar com Google</span>
        </>
      )}
    </Button>
  )
}
