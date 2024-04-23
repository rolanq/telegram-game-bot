import { Markup } from "telegraf";

export const COURIER_JOB_BUTTONS = Markup.inlineKeyboard([
  [{ text: "Стать Курьером", callback_data: "choose_courier" }],
  [{ text: "Следующий", callback_data: "next_job_chef" }],
]).reply_markup;

export const CHEF_JOB_BUTTONS = Markup.inlineKeyboard([
  [{ text: "Стать Шеф-поваром", callback_data: "choose_chef" }],
  [{ text: "Следующий", callback_data: "next_job_office" }],
]).reply_markup;

export const OFFICE_JOB_BUTTONS = Markup.inlineKeyboard([
  [{ text: "Стать Айтишником", callback_data: "choose_office" }],
  [{ text: "Следующий", callback_data: "next_job_courier" }],
]).reply_markup;

export const JOBS_BUTTONS = {
  courier: COURIER_JOB_BUTTONS,
  chef: CHEF_JOB_BUTTONS,
  office: OFFICE_JOB_BUTTONS,
};
