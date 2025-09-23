import { createAuthClient } from "better-auth/react"
const authClient =  createAuthClient()

const signInWithGithub = async () => {
    const data = await authClient.signIn.social({
        provider: "github"
    })
}
export const { signOut, signUp, useSession, forgetPassword, resetPassword } = authClient
export { signInWithGithub }