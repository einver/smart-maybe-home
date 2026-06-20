using Microsoft.AspNetCore.Mvc;
using SmartHome.DTOs.Auth;
using SmartHome.Services;

namespace SmartHome.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var token = await _authService.Register(dto.Email, dto.Password);

            if (token == null)
                return BadRequest("Что-то пошло не так");

            return Ok(new { token });
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            var token = _authService.Login(dto.Email, dto.Password);

            if (token == null)
                return Unauthorized("Неверно введён логин или пароль");

            return Ok(new { token });
        }
    }

}