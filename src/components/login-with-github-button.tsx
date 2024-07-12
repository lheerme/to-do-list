import { useMutation } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'

import { GithubMark } from '@/assets/github-mark'
import { Button } from '@/components/ui/button'
import { loginWithGithub } from '@/services/login-with-github'
import { useStore } from '@/store/use-store'

export function LoginWithGithubButton() {
  const isLoggingIn = useStore((state) => state.isLoggingIn)
  const setIsLoggingIn = useStore((state) => state.setIsLoggingIn)
  const [isLoginWithGithubPending, setIsLoginWithGithubPending] =
    useState(false)

  const { mutateAsync: loginUserWithGithub } = useMutation({
    mutationFn: loginWithGithub,
    onSuccess: () => {
      setIsLoginWithGithubPending(true)
    },
  })

  async function handleSignInWithGithub() {
    setIsLoggingIn(true)
    await loginUserWithGithub()
  }

  return (
    <Button
      type="submit"
      disabled={isLoginWithGithubPending || isLoggingIn}
      onClick={handleSignInWithGithub}
      className="w-full"
    >
      {isLoginWithGithubPending ? (
        <LoaderCircle className="size-[1.2rem] animate-spin" />
      ) : (
        <>
          <GithubMark className="mr-2 h-[1.3rem] w-[1.3rem] text-background" />{' '}
          <span className="pt-0.5">Entrar com Github</span>
        </>
      )}
    </Button>
  )
}
