"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 403 };
    }

    const userExist = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
    });

    console.log(userExist);

    if (userExist) {
      return { status: 200, data: userExist };
    }

    const newUser = await client.user.create({
      data: {
        email: user.emailAddresses[0].emailAddress,
        firstame: user.firstName,
        lastname: user.lastName,
        clerkid: user.id,
        image: user.imageUrl,
      },
    });

    if (newUser) {
      return { status: 201, data: newUser };
    }
    return { status: 400 };
  } catch (error) {
    return { status: 500 };
  }
};

export const getAvatar = async () => {
  const user = await currentUser();

  return {
    image: user?.imageUrl,
    lastname: user?.lastName,
    firstname: user?.firstName,
  };
};
