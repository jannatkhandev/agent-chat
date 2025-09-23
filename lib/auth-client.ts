import { createAuthClient } from "better-auth/react"
const authClient =  createAuthClient()

const signInWithGithub = async () => {
    const data = await authClient.signIn.social({
        provider: "github"
    })
}
export const { signIn, signOut, signUp, useSession, forgetPassword, resetPassword } = authClient
export { signInWithGithub }