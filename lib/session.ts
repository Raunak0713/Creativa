import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from 'next-auth/providers/google';
import jsonwebtoken from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: '',
            clientSecret: ''
        })
    ],
    jwt: {
        // encode: () => {

        // },
        // decode: () => {

        // }
    }
}