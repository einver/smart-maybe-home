using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartHome.Data;
using SmartHome.Models;
using System.Security.Claims;
using SmartHome.DTOs;
using Microsoft.EntityFrameworkCore;
using SmartHome.Services;

namespace SmartHome.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class RoomsController : ControllerBase
	{
		private readonly AppDbContext _context;

		public RoomsController(AppDbContext context)
		{
			_context = context;
		}

		// Получить все комнаты пользователя
		[HttpGet]
		public IActionResult GetRooms()
		{
			var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

			var rooms = _context.Rooms
				.Where(r => r.UserId == userId)
				.ToList();

			return Ok(rooms);
		}

        // Создать комнату
        [HttpPost]
        public async Task<IActionResult> CreateRoom([FromBody] CreateRoomDto dto)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var room = new Room
            {
                Name = dto.Name,
                UserId = userId
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return Ok(room);
        }

        // Удалить комнату
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(Guid id)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var room = await _context.Rooms
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

            if (room == null)
                return NotFound();

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("test-telegram")]
        public async Task<IActionResult> TestTelegram(
            [FromServices] TelegramBotService telegram)
        {
            await telegram.SendMessage(
                738240361,
                "SmartHome test message");

            return Ok();
        }
        [HttpGet("telegram-test")]
        public async Task<IActionResult> TelegramTest()
        {
            using var client = new HttpClient();

            var response = await client.GetAsync(
                "https://www.google.com");

            return Ok(response.StatusCode);
        }
        [HttpGet("telegram-ipv4-test")]
        public async Task<IActionResult> Test()
        {
            using var client = new HttpClient();

            var ipv4 = await client.GetStringAsync("https://api.ipify.org");

            return Ok(ipv4);
        }
        [HttpGet("telegram-direct")]
        public async Task<IActionResult> TelegramDirect()
        {
            using var client = new HttpClient();

            var r = await client.GetAsync("https://api.telegram.org");

            return Ok(await r.Content.ReadAsStringAsync());
        }
    }
}