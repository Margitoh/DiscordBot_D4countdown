require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("Bot is ready...");
  startCountdown();
});

client.on("messageCreate", (message) => {
  console.log(message);
});

async function startCountdown() {
  const targetDate = new Date("2023-06-02T01:00:00+02:00"); // June 2nd, 1 AM CEST
  const channelId = "1113604806645383178";
  let countdownMessage;

  if (Date.now() >= targetDate) {
    console.log("Countdown is already over.");
    return;
  }

  const channel = client.channels.cache.get(channelId);
  if (!channel) {
    console.log(`Channel with ID ${channelId} not found.`);
    return;
  }

  const countdownInterval = setInterval(async () => {
    const now = new Date();
    const timeLeft = targetDate - now;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      console.log("Diablo IV Early Access is live now!");
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    countdownMessage = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds left until Early Access is live`;

    // console.log(countdownMessage);

    try {
      const messages = await channel.messages.fetch({ limit: 1 });
      const lastMessage = messages.first();

      if (lastMessage) {
        if (lastMessage.author.id === client.user.id) {
          lastMessage.edit(countdownMessage);
        } else {
          lastMessage.delete();
          channel.send(countdownMessage);
        }
      } else {
        channel.send(countdownMessage);
      }
    } catch (error) {
      console.error("Error fetching or editing message:", error);
    }
  }, 1000);
}

client.login(process.env.token);
