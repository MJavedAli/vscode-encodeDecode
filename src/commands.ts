"use strict";
import * as vscode from "vscode";
let cryptoJs = require('crypto-js');
const key = cryptoJs.enc.Utf8.parse('7061737323313233');
const _iv = cryptoJs.enc.Utf8.parse('7061737323313233');

function changeText(f: (txt: string) => string): void {
  if (!vscode.window.activeTextEditor) {
    return;
  }

  let e = vscode.window.activeTextEditor;
  let d = e.document;
  let sel = e.selections;
  e.edit(function(edit) {
    for (var x = 0; x < sel.length; x++) {
      let txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end));
      try {
        edit.replace(sel[x], f(txt));
      } catch (e) {
        console.log(e);
      }
    }
  });
}

function isBase64(txt: string): boolean {
  return Buffer.from(txt, "base64").toString("base64") === txt;
}

function base64d(txt: string): string {
  if (!isBase64(txt)) {
    throw new Error("Selected text is not base64.");
  }

  return Buffer.from(txt, "base64").toString();
}

export function Base64() {
  changeText(txt => Buffer.from(txt).toString("base64"));
}

export function Base64D() {
  changeText(base64d);
}

export function AESEncrypt(){
  changeText(txt => {
    let encrypted = cryptoJs.AES.encrypt(cryptoJs.enc.Utf8.parse(txt),key,{keySize: 128 / 8,iv: _iv,mode: cryptoJs.mode.CBC,padding: cryptoJs.pad.Pkcs7,});
    return encrypted.toString();
  });
}

export function AESDecrypt(){
  changeText(txt => {
    let decrypted = cryptoJs.AES.decrypt(txt, key, {
      keySize: 128 / 8,
      iv: _iv,
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7,
    }).toString(cryptoJs.enc.Utf8);
    return decrypted;
  });
}

export function OpenInNewTab(): void {
  if (!vscode.window.activeTextEditor) {
    return;
  }

  let e = vscode.window.activeTextEditor;
  let d = e.document;
  let sel = e.selections;
  for (var x = 0; x < sel.length; x++) {
    let txt: string = d
      .getText(new vscode.Range(sel[x].start, sel[x].end))
      .trim();
    try {
      txt = base64d(txt);
    } catch (e) {
      console.log("Not a Base64 text.");
    }
    let options: {language?: string; content?: string} = {};
    try {
      txt = JSON.stringify(JSON.parse(txt), null, 2);
      options.language = 'json';
    } catch (e) {
      console.log("Not a JSON.");
    }
    options.content = txt;
    vscode.workspace
      .openTextDocument(options)
      .then(doc => vscode.window.showTextDocument(doc, { preview: false }));
  }
}
