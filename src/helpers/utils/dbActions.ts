import { Chat, User } from "helpers/consts/models";
import { Context } from "telegraf";
import { catchError } from "./async";
import { UserT } from "types/user";
import { isChat } from "./checks";
import { ChatT } from "types";

export const addChat = async (ctx: Context): Promise<void> => {
  if (isChat(ctx)) {
    const isChatExists = await Chat.findOne({ where: { id: ctx.chat?.id } });
    console.log(isChatExists);

    if (!isChatExists) {
      catchError(Chat.create({ id: ctx.chat?.id }));
    }
  }
};

export const addUser = async (ctx: Context): Promise<void> => {
  if (!isChat(ctx)) {
    return;
  }

  const user: UserT = await User.findOne({
    where: { chatId: ctx.chat?.id, id: ctx.from?.id },
  });

  if (!user) {
    await User.create({
      chatId: ctx.chat?.id,
      id: ctx.from?.id,
      condition: "waiting",
      name: "Пушистик",
      role: "Безработный",
      strength: 1,
      intelligence: 1,
      money: 0,
      username: ctx.from?.username,
    });
  }
};

export const getUser = async (
  chatId: number,
  attributes: Partial<UserT>
): Promise<UserT | undefined> => {
  const user = await User.findOne({
    where: { chatId, ...attributes },
  });

  if (user) return user;
  return undefined;
};

export const getAllUsersInChat = async (
  chatId: number
): Promise<UserT[] | undefined> => {
  const users: UserT[] = await User.findAll({
    where: { chatId },
  });

  if (users) return users;
  return undefined;
};

export const getChat = async (id: number): Promise<ChatT | undefined> => {
  const chat: ChatT = await Chat.findOne({ where: { id } });

  if (chat) return chat;
  return undefined;
};

export const updateUser = async (
  newValues: Partial<UserT>,
  id: number,
  chatId: number
): Promise<void> => {
  await User.update(newValues, {
    where: { id, chatId },
  });
};
