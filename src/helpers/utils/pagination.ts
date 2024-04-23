import { Context, Markup } from "telegraf";
import { SceneContext, WizardContext } from "telegraf/typings/scenes";

interface Item {
  id: number;
  text: string;
  image?: string;
}

interface Buttons {
  next: string;
  previous: string;
  select: string;
}

const defaultButtonsNamings: Buttons = {
  previous: "⬅️",
  next: "➡️",
  select: "Выбрать",
};

export class Pagination<T extends Item> {
  items: T[];
  onSelect: (item: T, ctx: SceneContext | WizardContext) => void;
  buttonsNaming: Buttons;
  currentItemIndex: number;
  currentItem: T;

  constructor(
    items: T[],
    onSelect: (item: T, ctx: SceneContext | WizardContext) => void,
    buttonsNaming: Buttons = defaultButtonsNamings
  ) {
    this.items = items;
    this.onSelect = onSelect;
    this.currentItemIndex = 0;
    this.buttonsNaming = buttonsNaming;
    this.currentItem = this.items[this.currentItemIndex];
  }

  generateKeyboard() {
    return Markup.inlineKeyboard([
      [
        {
          text: this.buttonsNaming?.previous,
          callback_data: `previous`,
        },
        {
          text: this.buttonsNaming?.next,
          callback_data: `next`,
        },
      ],
      [
        {
          text: this.buttonsNaming.select,
          callback_data: `select`,
        },
      ],
    ]).reply_markup;
  }

  async sendMessage(ctx: Context) {
    const buttons = this.generateKeyboard();

    if (this.currentItem.text && this.currentItem.image) {
      await ctx.editMessageMedia({
        media: this.currentItem.image,
        caption: this.currentItem.text,
        type: "photo",
        parse_mode: "HTML",
      });
      await ctx.editMessageReplyMarkup(buttons);
    } else if (this.currentItem.text) {
      ctx.editMessageText(this.currentItem.text, {
        reply_markup: buttons,
        parse_mode: "HTML",
      });
    }
  }

  async sendFirstMessage(ctx: SceneContext | WizardContext) {
    const buttons = this.generateKeyboard();
    if (this.currentItem.text && this.currentItem.image) {
      ctx.replyWithPhoto(this.currentItem.image, {
        caption: this.currentItem.text,
        reply_markup: buttons,
        parse_mode: "HTML",
      });
    } else if (this.currentItem.text) {
      ctx.reply(this.currentItem.text, {
        reply_markup: buttons,
        parse_mode: "HTML",
      });
    }
  }

  async handlePagination(ctx: SceneContext | WizardContext) {
    const { data }: any = ctx.callbackQuery;
    const callback: string = data;

    if (callback.includes("next")) {
      this.currentItemIndex = this.currentItemIndex + 1;
      this.currentItem = this.items[this.currentItemIndex];
    } else if (callback.includes("previous")) {
      this.currentItemIndex = this.currentItemIndex - 1;
      this.currentItem = this.items[this.currentItemIndex];
    } else if (callback.includes("select")) {
      this.onSelect(this.currentItem, ctx);
      await ctx.deleteMessage(ctx.message?.message_id);
      if (ctx.scene) {
        ctx.scene.leave();
      }
      return;
    }

    await this.sendMessage(ctx);
  }
}
