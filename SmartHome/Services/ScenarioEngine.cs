using SmartHome.Models;

namespace SmartHome.Services
{
    public class ScenarioEngine
    {
        private readonly ScenarioService _scenarioService;

        public ScenarioEngine(ScenarioService scenarioService)
        {
            _scenarioService = scenarioService;
        }

        public async Task ProcessEvent(DeviceEvent deviceEvent)
        {
            await _scenarioService.HandleDeviceEvent(deviceEvent);
        }
    }
}