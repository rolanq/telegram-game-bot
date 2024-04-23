import { Context } from "telegraf";
import {
  SceneContext, WizardContext,
} from "telegraf/typings/scenes";


export type BotContext = Context & WizardContext;
