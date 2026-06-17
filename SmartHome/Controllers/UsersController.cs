using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHome.Data;
using SmartHome.DTOs;
using System.Security.Claims;
using SmartHome.Services;

namespace SmartHome.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("telegram")]
    public async Task<IActionResult> GetTelegram()
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var user = await _context.Users
            .FirstAsync(x => x.Id == userId);

        return Ok(new
        {
            user.TelegramChatId
        });
    }

    [HttpPost("telegram")]
    public async Task<IActionResult> LinkTelegram(
        LinkTelegramDto dto)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var user = await _context.Users
            .FirstAsync(x => x.Id == userId);

        user.TelegramChatId = dto.ChatId;

        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("telegram")]
    public async Task<IActionResult> UnlinkTelegram()
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var user = await _context.Users
            .FirstAsync(x => x.Id == userId);

        user.TelegramChatId = null;

        await _context.SaveChangesAsync();

        return Ok();
    }
    [HttpGet("test-telegram")]
    public async Task<IActionResult> TestTelegram(
    [FromServices] TelegramBotService telegram)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);

        var user = await _context.Users
            .FirstAsync(x => x.Id == userId);

        if (user.TelegramChatId == null)
        {
            return BadRequest(
                "Telegram not linked");
        }

        await telegram.SendMessage(
            user.TelegramChatId.Value,
            "Тестовое сообщение SmartHome");

        return Ok();
    }
}