import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

import { PrismaClient } from "prisma/prisma-client";
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export default NextAuth({
    providers : [

        CredentialsProvider({
            name : "Credentials",
            async authorize(credentials, req){
                

                // check user existance
                const result = await prisma.users.findFirst({
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
    session: {
        strategy: 'jwt',
    }
})