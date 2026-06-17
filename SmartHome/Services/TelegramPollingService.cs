using Microsoft.EntityFrameworkCore;
using SmartHome.Data;
using SmartHome.Models;
using System.Text.Json;
using Microsoft.Extensions.Hosting;

namespace SmartHome.Services
{
    public class TelegramPollingService : BackgroundService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly TelegramBotService _telegram;

        private long _lastUpdateId = 0;

        public TelegramPollingService(
            HttpClient httpClient,
            IConfiguration configuration,
            TelegramBotService telegram)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _telegram = telegram;
        }

        protected override async Task ExecuteAsync(
            CancellationToken stoppingToken)
        {
            var token =
                _configuration["Telegram:BotToken"];

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var url =
                        $"https://api.telegram.org/bot{token}/getUpdates?offset={_lastUpdateId + 1}";

                    var response =
                        await _httpClient.GetStringAsync(
                            url,
                            stoppingToken);

                    using var doc =
                        JsonDocument.Parse(response);

                    var updates =
                        doc.RootElement
                            .GetProperty("result");

                    foreach (var update in updates.EnumerateArray())
                    {
                        _lastUpdateId =
                            update.GetProperty("update_id")
                                  .GetInt64();

                        if (!update.TryGetProperty(
                                "message",
                                out var message))
                        {
                            continue;
                        }

                        var text =
                            message.GetProperty("text")
                                   .GetString();

                        var chatId =
                            message.GetProperty("chat")
                                   .GetProperty("id")
                                   .GetInt64();

                        await HandleMessage(
                            chatId,
                            text);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(
                        $"Telegram polling error: {ex.Message}");
                }

                await Task.Delay(
                    TimeSpan.FromSeconds(3),
                    stoppingToken);
            }
        }

        private async Task HandleMessage(
            long chatId,
            string? text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return;

            if (text.StartsWith("/start"))
            {
                await _telegram.SendMessage(
                    chatId,
                    $"""
                🏠 Добро пожаловать в SmartHome

                Ваш Telegram Chat ID:

                {chatId}

                Скопируйте этот номер и вставьте его в настройки SmartHome.
                """
                );
            }
        }
    }


}