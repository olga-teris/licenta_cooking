import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

import { PrismaClient } from "prisma/prisma-client";
import { compare } from 'bcryptjs';
// import prisma from "../../../lib/prisma";
const prisma = new PrismaClient();

export const authOptions = {
    providers : [

        CredentialsProvider({
            name : "Credentials",
            async authorize(credentials, req){
                
                // console.log(credentials)
                // check user existance
                const result = await prisma.user.findFirst({
                    where: {
                        email: credentials.email
                    }
                });
                if(!result){
                    throw new Error("No user Found with Email Please Sign Up...!")
                }

                // compare()
                const checkPassword = await compare(credentials.password, result.password);
                
                // incorrect password
                if(!checkPassword || result.email !== credentials.email){
                    throw new Error("Username or Password doesn't match");
                }

                return result;
 
            }
        })
    ],
    secret: "XH6bp/TkLvnUkQiPDEZNyHc0CV+VV5RL/n+HdVHoHN0=",
    callbacks: {
        session: async ({ session, token}) => {
            // console.log(token)
            const result = await prisma.user.findFirst({
                where: {
                    email: token.email
                }
            });
            if (session?.user) {
              session.user.id = result.id;
              session.user.image = ""
            }
            // console.log(session)
            return session;
          },
    },
    session: {
        strategy: 'jwt',
    }
}

export default NextAuth(authOptions)