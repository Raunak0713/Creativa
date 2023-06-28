import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from 'next-auth/providers/google';
import jsonwebtoken from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';
import { signIn } from "next-auth/react";
import { SessionInterface, UserProfile } from "@/common.types";
import { createUser, getUser } from "./actions";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    jwt: {
        encode: ({ secret, token }) => {
            const encodedToken = jsonwebtoken.sign(
                {
                    ...token,
                    iss: "grafbase",
                    exp: Math.floor(Date.now() / 1000) + 60 * 60,
                },
                secret
            );

            return encodedToken;
        },
        decode: async ({ secret, token }) => {
            const decodedToken = jsonwebtoken.verify(token!, secret);
            return decodedToken as JWT;
        },
    },
    theme: {
        colorScheme: "light",
        logo: "/logo.svg",
    },
    callbacks: {
        async session({ session }){
            const email = session?.user?.email as string;
            try{
                const data = await getUser(email) as { user?:UserProfile}
                const newsession = {
                    ...session,
                    user: {
                        ...session.user,
                        ...data?.user
                    }
                }
                return newsession;
            }catch(error){
                console.log('error retriving user data', error);
                return session;
            }
        },
        async signIn({ user } : { user : AdapterUser | User}){
            try{
                // get the user if they exist in the database
                const userExists = await getUser(user?.email as string) as { user?: UserProfile }

                // or else create a new user
                if(!userExists.user){
                    await createUser(
                        user.name as string, 
                        user.email as string, 
                        user.image as string
                    );
                }

                return true
            }catch(error : any){
                console.log(error);
                return false;
            }
        }
    }
}

export async function getCurrentUser(){
    const session = await getServerSession(authOptions) as SessionInterface;
    return session;
}