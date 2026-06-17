using System.Text;
using System.Text.Json;
using System.Net;
using System.Net.Sockets;

namespace SmartHome.Services;

public class TelegramBotService
{
    private readonly HttpClient _httpClient;
    private readonly string _botToken;

    public TelegramBotService(
        HttpClient httpClient,
        IConfiguration configuration)
    {
        _httpClient = httpClient;

        _botToken =
            configuration["Telegram:BotToken"]
            ?? throw new Exception("Telegram token missing");
    }

    public async Task SendMessage(long chatId, string text)
    {
        var url = $"https://api.telegram.org/bot{_botToken}/sendMessage";

        var handler = new SocketsHttpHandler
        {
            ConnectCallback = async (context, token) =>
            {
                var addresses = await Dns.GetHostAddressesAsync(context.DnsEndPoint.Host);

                var ipv4 = addresses.First(x => x.AddressFamily == AddressFamily.InterNetwork);

                var socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                await socket.ConnectAsync(ipv4, context.DnsEndPoint.Port, token);

                return new NetworkStream(socket, ownsSocket: true);
            }
        };

        using var client = new HttpClient(handler);

        var content = new FormUrlEncodedContent(new[]
        {
        new KeyValuePair<string, string>("chat_id", chatId.ToString()),
        new KeyValuePair<string, string>("text", text)
    });

        var response = await client.PostAsync(url, content);
        var body = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception(body);
    }
}