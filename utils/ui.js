const {
  ModalBuilder, ActionRowBuilder,
  ButtonBuilder, ButtonStyle,
  TextInputBuilder, TextInputStyle
} = require('discord.js');

function CreateModal(id, title, label, style) {
  // Create the modal
  const modal = new ModalBuilder()
    .setCustomId(id)
    .setTitle(title);

  const textId = id + 'Input';
  // Add components to modal
  const input = new TextInputBuilder()
    .setCustomId(textId)
    .setLabel(label)
    .setStyle(style);
  const row = new ActionRowBuilder().addComponents(input);

  // Add inputs to the modal
  modal.addComponents(row);

  return modal;
}

function CreateButtons(buttons) {
  const row = new ActionRowBuilder()
    .addComponents(buttons);
  return row;
}

function CreateButton(id, label, emoji, style) {
  var button = null;
  if (label == "") {
    button = new ButtonBuilder()
      .setCustomId(id)
      .setEmoji(emoji)
      .setStyle(style)
  }
  else {
    button = new ButtonBuilder()
      .setCustomId(id)
      .setLabel(label)
      .setStyle(style)
  }

  return button;
}

function CreateDialog(id, title, label) {
  return CreateModal(id, title, label, TextInputStyle.Short)
}

function CreateInteractionButtons() {
  var primaryButton = CreateButton('hetui', `嗬!`, "", ButtonStyle.Primary);
  var alarmButton = CreateButton('alarm', `报警`, "", ButtonStyle.Success);
  var nopeButton = CreateButton('nope', "退!", '❌', ButtonStyle.Danger);
  //nopeButton.setDisabled(true);
  const buttons = [primaryButton, nopeButton, alarmButton];
  return CreateButtons(buttons);
}

function ParseWord(message) {
  const array = message.split('【');
  const msgHalf = array[array.length - 1];
  const arrayLeft = msgHalf.split('】');
  return arrayLeft[0];
}

module.exports = { CreateDialog, CreateInteractionButtons, ParseWord };