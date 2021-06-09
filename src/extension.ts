"use strict";
import * as vscode from "vscode";
import { Base64, Base64D,AESEncrypt,AESDecrypt, OpenInNewTab } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  console.log("Encode-Decode Extension launched.");

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.Base64", Base64),
    vscode.commands.registerCommand("extension.Base64D", Base64D),
    vscode.commands.registerCommand("extension.AESEncrypt", AESEncrypt),
    vscode.commands.registerCommand("extension.AESDecrypt", AESDecrypt),
    vscode.commands.registerCommand("extension.OpenInNewTab", OpenInNewTab),
  );
}


export function deactivate() {}
