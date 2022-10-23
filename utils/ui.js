const { MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');

function CreateModal(id, title, label, style) {
  // Create the modal
  const modal = new Modal()
    .setCustomId(id)
    .setTitle(title);

  const textId = id + 'Input';
  // Add components to modal
  const input = new TextInputComponent()
    .setCustomId(textId)
    .setLabel(label)
    .setStyle(style);
  const row = new MessageActionRow().addComponents(input);

  // Add inputs to the modal
  modal.addComponents(row);

  return modal;
}

function CreateButtons(buttons) {
  const row = new MessageActionRow()
    .addComponents(buttons);
  return row;
}

function CreateButton(id, label, emoji, style) {
  var button = null;
  if (label == "") {
    button = new MessageButton()
      .setCustomId(id)
      .setEmoji(emoji)
      .setStyle(style)
  }
  else {
    button = new MessageButton()
      .setCustomId(id)
      .setLabel(label)
      .setStyle(style)
  }

  return button;
}

function CreateButtonRow() {
  var primaryButton = CreateButton('hetui', `嗬!`, "", `PRIMARY`);
  var alarmButton = CreateButton('alarm', `报警`, "", `SUCCESS`);
  var nopeButton = CreateButton('nope', "退!", '❌', `DANGER`);
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

module.exports = { CreateModal, CreateButtonRow, ParseWord };